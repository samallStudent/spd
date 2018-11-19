/*
 * @Author: xx 
 * @Date: 
 * @Last Modified by: xx
 * @Last Modified time: 
 */
 /**
 * @file 基数药--抢救车--抢救车库存
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Select, Button,Icon} from 'antd';
import { Link } from 'react-router-dom'
import { formItemLayout } from '../../../../utils/commonStyles';
import RemoteTable from '../../../../components/TableGrid/index'; 
import salvageCar from '../../../../api/baseDrug/salvageCar';
import {connect} from 'dva';

const FormItem = Form.Item;
const { Option } = Select;


class formSearch extends PureComponent{
    handlSearch = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            console.log(values);
            if(!err){
                this.props.query(values);
            }
        })
    }
    handleReset = (e) =>{
        this.props.form.resetFields();
        this.props.query({});
    }
    render(props){
        const { getFieldDecorator } = this.props.form;

        return(
            <Form className="ant-advanced-search-form" onSubmit={this.handlSearch}>
                <Row gutter={30}>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`抢救出货位：`}>
                        {
                            getFieldDecorator(`type`,{
                                initialValue: ''
                            })(
                                <Select 
                                    style={{width:'100%'}}
                                    showSearch
                                    optionFilterProp="children"
                                    placeholder="请选择..."
                                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                                >
                                     <Option value=''>请选择...</Option> 
                                    { 
                                        this.props.typeListData.map((item,index)=>
                                            <Option value={item.id} key={index}>{item.name}</Option>
                                        )
                                    }
                                </Select>
                            )
                        }
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`关键字：`}>
                        {
                            getFieldDecorator(`keys`,{
                                initialValue: ''
                           })(
                               <Input 
                                  placeholder="通用名/商品名/规格/厂家"
                               />
                           )
                        }
                        </FormItem>
                    </Col>
                    <Col style={{textAlign: 'right'}} span={8}>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={(e)=>this.handleReset(e)}>重置</Button>
                        <a style={{marginLeft: 8,display:'none'}}>收起 <Icon type="down" /></a>
                    </Col>
                </Row>
            </Form>
        )
    }
};
const WrappSearchForm = Form.create()(formSearch);
class salvageStockList extends PureComponent{
    state = {
        visible: false,
        isDisabled: true,
        query: {},
        ModalTitle: '',
        record: {},
        loading: false,
        typeListData:[]
    };
    componentDidMount=()=>{
        const mosTypeListData =  [{
            id:'1',
            name:'张三'
        },{
            id:'2',
            name:'李四'
        }];
        this.setState({
            typeListData:mosTypeListData
        })
    }
    queryHandle = (query) =>{
        this.setState({ query });
        this.refs.salvageCarTable.fetch(query);
    }
    render(){
        // const mocData = [
        //     {
        //         id: '1',
        //         tym:'注射用复方甘草酸苷',
        //         spm:'注射用复方甘草酸苷',
        //         qjchw:'',
        //         gg:'甘草酸苷80mg',
        //         sccj:'湖北药业公司',
        //         bzgg:'0.25gX12片',
        //         dw:'瓶',
        //         kcsl:'1655',
        //         kykc:'1500',
        //         jx:'注射剂(冻干粉针剂)',
        //         pzwh:'86900234000039',
        //     }
        // ]
        const IndexColumns = [
            {
              title: '通用名',
              dataIndex: 'tym',
              width: 160,
              render: (text, record) => {
                return (
                  <span>
                    <Link to={{pathname: `/baseDrug/salvageCar/salvageCarStock/details/dCode=${record.drugCode}&bCode=${record.bigDrugCode}`}}>{text}</Link>
                  </span>  
                )
              }
            },{
              title: '商品名',
              dataIndex: 'spm',
              width: 160
            },{
              title: '抢救车货位',
              dataIndex: 'qjchw',
              width: 112,
            },{
              title: '规格',
              dataIndex: 'gg',
              width: 112,
            },{
              title: '生产厂家',
              dataIndex: 'sccj',
              width: 112,
            },{
              title: '包装规格',
              dataIndex: 'bzgg',
              width: 112,
            },{
              title: '单位',
              dataIndex: 'dw',
              width: 112,
            },{
              title: '库存数量',
              dataIndex: 'kcsl',
              width: 112,
            },{
              title: '可用库存',
              dataIndex: 'kykc',
              width: 112,
            },{
              title: '剂型',
              dataIndex: 'jx',
              width: 112,
            },{
              title: '批准文号',
              dataIndex: 'pzwh',
              width: 112,
            }
          ];
          
      return(
          <div>
              <WrappSearchForm query={this.queryHandle}  typeListData={this.state.typeListData}/>
              <RemoteTable
               query={this.state.query}
               ref="salvageCarTable"
               columns={IndexColumns}
               scroll={{x: '100%'}}
               rowKey={'id'}
               style={{marginTop: 20}}
               url={salvageCar.GET_SALVGECAR_LIST}
               loading={false}
              />
          </div>
      )
    }
}

export default connect(state=>state)(salvageStockList);