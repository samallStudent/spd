/**
 * @file 结算管理 - 日对账单
 */
import React, {PureComponent} from 'react';

import { Table, Tooltip } from 'antd';

import { createData } from '../../../../common/data';

let dataSource = createData().map( (item) => ({...item, key: item.id}) )

const columns = [
{
    title: '结算单号',
    dataIndex: 'medicinalCode',
}, {
    title: '结算时间',
    dataIndex: 'planTime',
}, {
    title: '通用名',
    dataIndex: 'geName',
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
    title: '生产厂家',
    dataIndex: 'productCompany',
}, {
    title: '批准文号',
    dataIndex: 'approvalNo',
}, {
    title: '供应商',
    dataIndex: 'tfAddress'
}, {
    title: '结余单位',
    dataIndex: 'unit'
}, {
    title: '当前结余',
    dataIndex: 'currentBalance'
}]


class Statements extends PureComponent{
    render() {
        return (
            <div className="fullCol">
                <div className="fullCol-fullChild">
                    结余查询
                </div>
                <div className="detailCard">
                    <Table
                        scroll={{x: '150%'}}
                        bordered={true}
                        columns={columns}
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
export default Statements;