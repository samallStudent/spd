import React from 'react';
import {Select, Spin, message,Row , Col} from 'antd';
// import querystring from 'querystring';
import request from '../../utils/request';
import {debounce} from 'lodash';
const Option = Select.Option;
// let timeout;
// let currentValue;

// function fake(value, callback, url, query, parmas) {
  
//   if (timeout) {
//     clearTimeout(timeout);
//     timeout = null;
//   }
//   currentValue = value;
//    fetch(url + '?searchName=' + value + '&' + querystring.stringify(query), {
//         method: 'get',
//         mode:'cors',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded'
//         },
//     })
//     .then(response => {
//       return response.json();
//     })
//     .then(d => {
//         if (currentValue === value) {
//           let result = d;
//           const data = [];
//           if(parmas){
//             result.forEach((r) => {
//               data.push({
//                 value: r.value.toString(),
//                 text: r.text,
//                 [parmas]: r[parmas]
//               });
//             });
//           }else{
//             result.forEach((r) => {
//               data.push({
//                 value: r.value.toString(),
//                 text: r.text
//               });
//             });
//           }
//           callback(data);   
//         }
//     })
//     .catch(e => console.log("Oops, error", e))

// }




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
    this.setState({
        value,
        ctmmManufacturerName:[option.props.ctmmManufacturerName],
        approvalNos:[option.props.approvalNos]?[option.props.approvalNos]:'',

    });
    console.log(value)
      const {getVal}=this.props;
      getVal(option.props)
    let {cb} = this.props;
    if(typeof cb === 'function') {
      cb && cb(value,option);
    }

  }

  handleChange = (value) => {
    if(value === '') {return};
    // fake(value, data => this.setState({ data }), this.props.url, this.props.query,this.props.parmas);
    this.setState({ data: [], fetching: true ,ctmmManufacturerName:'',approvalNos:''});
    let body;
    if(this.props.queryKey) {
      body = {
        [this.props.queryKey]: value
      };
    }else {
      body = {
       pageSize: 10,
       ctmmDesc: value,
       ctmmDosageFormDesc:'',
          ctmmStatusCode:'',
          medDrugType:'',
          pageNo: 1
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
          data: data.data.list,
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
        return <Option  key={item.bigDrugCode} value={item.bigDrugCode} ctmmManufacturerName={item.ctmmManufacturerName} approvalNos={item.approvalNo}>{item.ctmmAnotherName}</Option>
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