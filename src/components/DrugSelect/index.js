import React from 'react';
import {Select, Spin, message,Row , Col} from 'antd';

import request from '../../utils/request';
import {debounce} from 'lodash';
const Option = Select.Option;

class FetchSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      fetching: false,
      value: undefined,
      isPropsValue: false,  //判断是否用propsValue
        ctmmManufacturerName:'',
        approvalNos:'',
        goodsName:''
    };
    this.handleChange = debounce(this.handleChange, 800);
  }
  componentWillReceiveProps = (nextProps) => {
    if(nextProps.value !== undefined && !this.state.isPropsValue) {
      this.setState({
        isPropsValue: true
      });
    };
  }
  getValues = (value,option) => {
      let { data } = this.state;
    this.setState({
        value
    });
    console.log(value)
      const {getVal}=this.props;
      if(option){
          getVal(option.props)
      }
      data = data.find(item => item.id === value)
      let {cb} = this.props;
      if(cb && typeof cb === 'function') {
          cb(value, data);
      };

  }

    handleChange = (value) => {
        if(value === '') return;
        let queryKey = this.props.queryKey;
        // fake(value, data => this.setState({ data }), this.props.url, this.props.query,this.props.parmas);
        this.setState({ data: [], fetching: true  ,});
        let body;
        if(queryKey) {
            if(typeof queryKey === 'string') {
                body = {
                    [this.props.queryKey]: value
                };
            };
            if(typeof queryKey === 'object') {
                queryKey = {...queryKey};
                body = {
                    ...queryKey,
                    [queryKey.valueKey] : value
                };
                delete body.valueKey;
                console.log(body);

            };
        }else {
            body = {
                paramName: value,
                queryType: 3
            }
        }
        request(this.props.url, {
            method: this.props.method || 'POST',
            type: this.props.type || 'formData',
            body
        })
            .then((data)=>{
                if(data.code === 200 && data.msg === 'success') {
                    this.setState({
                        data: data.data,
                        fetching: false
                    });
                }else {
                    message.error(data.msg);
                }
            })
    }
  listRender = () => {
    let {data} = this.state;
    let {valueAndLabel,drglist} = this.props;
    if(valueAndLabel) {
      let {value, label} = valueAndLabel;
      return data.map((item, i) => {
        return <Option key={i} value={item[value]}>{item[label]}</Option>
      })
    }else {

        return data.map((item,index)=>{
            return <Option  key={item.bigDrugCode} value={item.bigDrugCode} ctmmManufacturerName={item.ctmmManufacturerName} approvalNos={item.approvalNo}>{item.ctmmParam}</Option>
        })
    }
  }

  render() {
    let {fetching, value, isPropsValue} = this.state;
    let realValue = value ? value : this.props.psgoodsName;
    return (
        <Select
            showSearch
            defaultValue={this.props.psgoodsName}
            onSearch={this.handleChange}
            value={realValue}
            onChange={this.getValues}
            notFoundContent={fetching ? <Spin size="small" /> : "暂无搜索结果"}
            style={this.props.style}
            defaultActiveFirstOption={false}
            showArrow={false}
            allowClear={this.props.allowClear}
            filterOption={false}
            disabled={this.props.disabled}
            placeholder={this.props.placeholder}
        >
            {this.listRender()}
        </Select>
    );
  }
}

export default FetchSelect;