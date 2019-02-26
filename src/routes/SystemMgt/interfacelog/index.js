/**
 * @author QER
 * @date 19/2/22
 * @Description: 接口监控
*/
import React, { PureComponent } from 'react';
import { Form, Row, Col, DatePicker, Input, Select, Button, Icon, message, Tooltip,Modal,Card,Tag} from 'antd';
import { Link } from 'react-router-dom';
import { formItemLayout } from '../../../utils/commonStyles';
import RemoteTable from '../../../components/TableGrid';
import { systemMgt } from '../../../api/systemMgt';

import { connect } from 'dva';
import moment from 'moment';
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const { Option } = Select;

class SearchForm extends PureComponent {
    state = {
        methodType: [],
        methodList: [],
        methodLists: [],
        factorList: [
            {value: "", label: "全部"},
            {value: "1", label: "营业执照"},
            {value: "2", label: "药品经营许可证"},
            {value: "3", label: "业务员授权书"}
        ],
        resultCode:[
            {value: "", label: "全部"},
            {value: "0", label: "成功"},
            {value: "-1", label: "失败"}
        ],
        showNow:false
    }

    handleProvinceChange = (value) => {
        console.log(value)

        this.props.formProps.dispatch({
            type: 'interfacelog/getRequestMethods',
            payload: {logType:value},
            callback: ({data, code, msg}) => {
                if(code === 200) {
                    this.setState({
                        methodList: data
                    });

                }
            }
        });
        this.setState({
            showNow:value
        })
        console.log(this.state.showNow)
    }


    componentDidMount = () =>{
        //分类list
        this.props.formProps.dispatch({
            type: 'interfacelog/getAllMethodType',
            callback: ({data, code, msg}) => {
                if(code === 200) {
                    this.setState({
                        methodType: data
                    });
                }
            }
        });
        //接口list
        this.props.formProps.dispatch({
            type: 'interfacelog/getRequestMethods',
            callback: ({data, code, msg}) => {
                if(code === 200) {
                    this.setState({
                        methodList: data
                    });
                }
            }
        });




    }

    toggle = () => {
        this.props.formProps.dispatch({
            type:'base/setShowHide'
        });
    }

    handleSearch = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const closeDate = values.closeDate === undefined ? '' : values.closeDate;
                if (closeDate.length > 0) {
                    values.startTime = closeDate[0].format('YYYY-MM-DD');
                    values.endTime = closeDate[1].format('YYYY-MM-DD');
                }else {
                    values.startTime = '';
                    values.endTime = '';
                };
                this.props.formProps.dispatch({
                    type:'base/updateConditions',
                    payload: values
                });
                this.props._handlQuery(values);
            }
        })
    }
    handleReset = () => {
        this.props.form.resetFields();
        this.props.formProps.dispatch({
            type:'base/clearQueryConditions'
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {methodList,resultCode ,methodType,showNow} = this.state;

        return (
            <Form onSubmit={this.handleSearch}>
                <Row gutter={30}>
                    <Col span={8}>
                        <FormItem label={'分类'} {...formItemLayout}>


                            {getFieldDecorator('requestType', {
                                initialValue: ''
                            })(
                                <Select
                                    onChange={this.handleProvinceChange}
                                    showSearch
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option key={''} value={''}>全部</Option>
                                    {
                                        methodType.map(item => (
                                            <Option key={item.logType}  value={item.logType}>{item.logTypeExplain}</Option>
                                        ))
                                    }
                                </Select>
                            )}

                        </FormItem>
                    </Col>
                    <Col span={10}>
                        <FormItem label={'接口'} {...formItemLayout}>
                            {getFieldDecorator('requestMethod', {
                                initialValue: showNow&&methodList?methodList[0].logMethod:''
                            })(
                               showNow? <Select

                                   showSearch
                                   placeholder={'请选择'}
                                   optionFilterProp="children"
                                   filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                               >
                                   {
                                       methodList.map(item => (
                                           <Option key={item.logMethod}  value={item.logMethod}>{item.logMethodExplain}</Option>
                                       ))
                                   }
                               </Select>: <Select
                                   onChange={this.onSecondCityChange}
                                   showSearch
                                   placeholder={'请选择'}
                                   optionFilterProp="children"
                                   filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                               >
                                   <Option key={''} value={''}>全部</Option>
                                   {
                                       methodList.map(item => (
                                           <Option key={item.logMethod}  value={item.logMethod}>{item.logMethodExplain}</Option>
                                       ))
                                   }
                               </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem label={'状态'} {...formItemLayout}>
                            {getFieldDecorator('resultCode', {
                                initialValue: ''
                            })(
                                <Select
                                    showSearch
                                    placeholder={'请选择'}
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                                >
                                    {
                                        resultCode.map((item,index)=> <Option key={index} value={item.value}>{item.label}</Option>)
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={'时间'} {...formItemLayout}>
                            {
                                getFieldDecorator(`closeDate`)(
                                    <RangePicker/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={10}>
                        <FormItem {...formItemLayout} label={`关键字`}>
                            {
                                getFieldDecorator(`requestParam`)(
                                    <Input placeholder='请输入关键字' />
                                )
                            }
                        </FormItem>
                </Col>
                    <Col span={6} style={{float: 'right', textAlign: 'right', marginTop: 4 }}>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>

                    </Col>
                </Row>
            </Form>
        )
    }
}
const SearchFormWarp = Form.create()(SearchForm);

class RecallAndLocked extends PureComponent {
    state = {
        loading: false,
        visible: false,
        display: 'none',
        query: {},
        countList:[]
    }
    handlQuery = (query) => {
        this.setState({query});
    }


    componentDidMount = () =>{
        //汇总list
        this.props.dispatch({
            type: 'interfacelog/getLogCountByDate',
            callback: ({data, code, msg}) => {
                if(code === 200) {
                    this.setState({
                        countList: data
                    });
                }
            }
        });

    }

    delete = () =>{
        let { selectedRows, query } = this.state;
        if (selectedRows.length === 0) {
            return message.warn('请选择一条数据');
        };
        selectedRows = selectedRows.map(item => item.id);
        this.setState({ loading: true });
        this.props.dispatch({
            type: 'supplierFactor/deleteSupplierFactor',
            payload: { ids: selectedRows },
            callback: () =>{
                message.success('删除成功');
                this.setState({ loading: false });
                this.refs.table.fetch(query);
            }
        })

    }
    _tableChange = values => {
        this.props.dispatch({
            type:'base/setQueryConditions',
            payload: values
        });
    }
    saveFactior=values=>{
        this.setState({ loading: true });
        let { query } = this.state;
        this.setState({ loading: true });
        this.props.dispatch({
            type:'supplierFactor/saveSupplierFactor',
            payload: values,
            callback: ({data, code, msg}) => {
                if(data === 1) {
                    message.success('保存成功');
                    this.setState({ loading: false });
                    this.refs.table.fetch(query);
                }
            }
        })
    }


    render() {
        const { loading,countList} = this.state;
        let query = this.props.base.queryConditons;
        query = {
            ...query,
            ...this.state.query
        }
        delete query.closeDate;
        const gridStyle = {
            width: '20%',


        };

        const columns = [
            {
                title: '接口名称',
                dataIndex: 'requestMethod',
                width: 200
            },
            {
                title: '状态',
                width:90,
                dataIndex: 'resultCodeName'
            },
            {
                title: '是否处理',
                width: 100,
                dataIndex: 'isHandle',
                render: (text,record) =>{
                    return record.isHandle==0?'已处理':'未处理'
                }

            },
            {
                title: '请求时间',
                width: 178,
                dataIndex: 'requestTime',

            },
            {
                title: '参数',
                width: 120,
                dataIndex: 'requestParam',
            },
            {
                title: '返回结果',
                width: 188,
                dataIndex: 'resultContent'
            },

        ];

        return (
            <div className='ysynet-main-content factor-content'>
                <SearchFormWarp
                    formProps={{...this.props}} _handlQuery={this.handlQuery}
                />
                <Card title="今日调用汇总">
                    {
                        countList.map((item,index)=> <Card.Grid style={gridStyle} key={index}>
                        <label className='inter-label'>{item.logTypeExplain}：</label><Tag color="orange">{item.totalCount}次</Tag><br/>
                        <label className='inter-label'>失败：</label><Tag color="red" style={{marginTop:'8px'}}>{item.failCount}次</Tag>
                        </Card.Grid>)
                    }


                </Card>
                <RemoteTable
                    onChange={this._tableChange}
                    ref='table'
                    query={query}
                    bordered
                    url={systemMgt.INTERFACELOG_LIST}
                    columns={columns}
                    rowKey={'id'}
                    scroll={{ x: '100%' }}
                    style={{marginTop: 20}}

                />

            </div>
        )
    }
}
export default connect(state => state)(RecallAndLocked);