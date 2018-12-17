import React, {PureComponent} from 'react';

import {Row, Col, Form, Input, Table, Tooltip } from 'antd';
import { formItemLayout } from '../../../utils/commonStyles';
import {createData} from '../../../common/data.js';

const FormItem = Form.Item;

/* const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
}
 */
const columns = [
    {
        title: '通用名',
        dataIndex: 'name',
    }, {
        title: '商品名',
        dataIndex: 'productName',
    }, {
        title: '规格',
        dataIndex: 'spec',
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
    }, {
        title: '剂型',
        dataIndex: 'fmodal',
        key: 'fmodal',
    }, {
        title: '包装单位',
        dataIndex: 'packingUnit',
    }, {
        title: '生产厂家',
        dataIndex: 'productCompany',
    }, {
        title: '批准文号',
        dataIndex: 'approvalNo',
    }, {
        title: '供应商',
        dataIndex: 'supplier',
    }, {
        title: '最小单位',
        dataIndex: 'mixUnit',
    }, {
        title: '本期消耗',
        dataIndex: 'expend',
    }, {
        title: '结算价格',
        dataIndex: 'settlementPrice'
    }, {
        title: '结算金额',
        dataIndex: 'totalMoney'
    }, {
        title: '上期结余',
        dataIndex: 'oldBalance'
    }, {
        title: '本期结余',
        dataIndex: 'nowBalance'
    }, {
        title: '生产批号',
        dataIndex: 'medicinalCode',
    }, {
        title: '生产日期',
        dataIndex: 'dateOfManu',
    }, {
        title: '有效期至',
        dataIndex: 'validUntil'
    }
]

let dataSource = createData();

dataSource = dataSource.map((item) => {
    return {
      ...item,
      key: item.id,
      name: item.productName,
      packingUnit: '瓶',
      pharmacyInventory: 111,
      floorInventory: 222,
      dateOfManu: '2017-8-23',
      validUntil: '2018-8-23',
      supplier: '国药药业集团',
      operation: '查看'
    }
  })

class SettlementDetails extends PureComponent {
    render() {
        let {getFieldDecorator} = this.props.form;
        return (
            <div className="fullCol fadeIn">
                <div className="fullCol-fullChild">
                    <h3 style={{fontWeight: 'bold'}}>
                        汇总单：KFHZ00221180700001RP
                    </h3>
                    <Row style={{marginTop: 20, marginBottom: 20}}>
                        <Col span={8}>
                            库房：药库
                        </Col>
                        <Col span={8}>
                            制单人：张飞
                        </Col>
                        <Col span={8}>
                            制单时间：2018-07-12 17:09:15
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <Form>
                                <FormItem
                                    style={{textAlign: 'left'}}
                                    {...formItemLayout}
                                    label="名称："
                                >
                                    {getFieldDecorator('email')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Form>
                        </Col>
                    </Row>
                </div>
                <div className='detailCard'>
                    <Table
                        columns={columns}
                        scroll={{x: '250%'}}
                        bordered
                        title={()=>'产品信息'}
                        dataSource={dataSource}
                        pagination={{
                            size: 'small',
                            showQuickJumper: true,
                            showSizeChanger : true,
                            showTotal: (total) => {
                            return `总共${total}个项目`;
                            }
                        }}
                    />
                </div>
            </div>
        )
    }
};

const WrappedSettlementDetails = Form.create()(SettlementDetails)
export default WrappedSettlementDetails;