/*
 * @Author: wwb 
 * @Date: 2018-09-06 00:16:17 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-09-06 19:02:49
 */

import React, { PureComponent } from 'react';
import { Table ,Row, Col, Button, Tooltip, Modal, Spin, message } from 'antd';
import { connect } from 'dva';

class RecallAndLockedDetail extends PureComponent {
	constructor(props){
    super(props)
    this.state={
			spinning: false,
      detailsData: {},
	  dataSource: [],
	  checkLoading: false,
      rejectLoading: false
    }
  }
	componentWillMount = () =>{
		const { recallNo } = this.props.match.params;
		const { dispatch } = this.props;
		this.setState({ spinning: true });
		dispatch({
			type: 'outStorage/recallDetail',
			payload: { recallNo },
			callback: (data) =>{
				this.setState({ detailsData: data, dataSource: data.roomReCallDetailVoList, spinning: false })
			}
		})

	}
    // 驳回
  reject = () => {
    Modal.confirm({
      content:"您确定要执行此操作？",
      onOk: () => {
        const { dispatch, history } = this.props;
				const { recallNo } = this.props.match.params;
				this.setState({
					rejectLoading: true		
				})
				dispatch({
					type: 'outStorage/auditReject',
					payload: { recallNo },
					callback: () =>{
						message.success('审核不通过成功');
						history.push({pathname:"/drugStorage/outStorage/recallAndLockedCheck"});
						this.setState({
							rejectLoading: false		
						})
					}
				})
      },
      onCancel: () => {}
    })
	}
	// 审核通过
	pass = () =>{
		Modal.confirm({
			content:"确认审核通过？",
			onOk : () =>{
				let detailList = [ {recallNo:this.props.match.params.recallNo} ];
				let { dispatch, history } = this.props;
				this.setState({
					checkLoading: true
				})
				dispatch({
					type: 'outStorage/batchAudit',
					payload: { detailList },
					callback: () =>{
						message.success('审核通过成功');
						history.push({ pathname: '/drugStorage/outStorage/recallAndLockedCheck' });
						this.setState({
							checkLoading: false
						})
					}
				})
			},
			onCancel: () =>{

			}
		})
	}
	render() {
		const { detailsData, dataSource, spinning } = this.state;
		const { recallStatus } = this.props.match.params;
		let { checkLoading,rejectLoading} = this.state;
		const columns = [
			/*{
				title: '通用名',
				dataIndex: 'ctmmGenericName',
				width: 224,
				className: 'ellipsis',
				render: (text) => (
					<Tooltip placement="topLeft" title={text}>{text}</Tooltip>
				)
			},*/
			{
				title: '药品名称',
				dataIndex: 'ctmmTradeName',
				width: 350,
				className: 'ellipsis',
				render: (text) => (
					<Tooltip placement="topLeft" title={text}>{text}</Tooltip>
				)
			},
			/*{
				title: '规格',
				dataIndex: 'ctmmSpecification',
				width: 168,
				className: 'ellipsis',
				render: (text) => (
						<Tooltip placement="topLeft" title={text}>{text}</Tooltip>
				)
			},*/
			{
				title: '剂型',
				width: 90,
				dataIndex: 'ctmmDosageFormDesc'
			},
			{
				title: '包装规格',
				width: 168,
				dataIndex: 'packageSpecification',
			},
			{
				title: '生产批号',
				width: 168,
				dataIndex: 'lot'
			},
			{
				title: '生产日期',
				width: 118,
				dataIndex: 'productDate',
			},
			{
				title: '有效期至',
				width: 118,
				dataIndex: 'validEndDate',
			},
			{
				title: '生产厂家',
				dataIndex: 'ctmmManufacturerName',
				width: 200,
				className: 'ellipsis',
				render: (text) => (
						<Tooltip placement="topLeft" title={text}>{text}</Tooltip>
				)
			},
			{
				title: '批准文号',
				dataIndex: 'approvalNo',
				width: 200,
			},
		];
			return (
				<Spin spinning={spinning}>
					<div className='fullCol fadeIn'>
						<div className='fullCol-fullChild'>
							<Row>
								<Col span={12}>
									<h2>单据信息</h2>
								</Col>
								{
									recallStatus === '1'
									&&
									<Col span={12} style={{ textAlign: 'right' }}>
										<Button type='primary' style={{ marginRight: 10 }} onClick={this.pass} loading={checkLoading}>审核通过</Button>
										<Button type='danger' onClick={this.reject} loading={rejectLoading}>不通过</Button>
									</Col>
								}
							</Row>
							<Row>
								<Col span={8}>
									<div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
										<label>召回单</label>
									</div>
									<div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
										<div className='ant-form-item-control'>{ detailsData.recallNo }</div>
									</div>
								</Col>
								<Col span={8}>
									<div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
										<label>状态</label>
									</div>
									<div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
										<div className='ant-form-item-control'>{ detailsData.recallStatusName }</div>
									</div>
								</Col>
								<Col span={8}>
									<div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
										<label>发起人</label>
									</div>
									<div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
										<div className='ant-form-item-control'>{ detailsData.createUserName }</div>
									</div>
								</Col>
								<Col span={8}>
									<div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
										<label>发起时间</label>
									</div>
									<div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
										<div className='ant-form-item-control'>{ detailsData.createDate }</div>
									</div>
								</Col>
								<Col span={8}>
									<div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
										<label>审核人</label>
									</div>
									<div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
										<div className='ant-form-item-control'>{ detailsData.updateUserName }</div>
									</div>
								</Col>
								<Col span={8}>
									<div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
										<label>审核时间</label>
									</div>
									<div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
										<div className='ant-form-item-control'>{ detailsData.updateDate }</div>
									</div>
								</Col>
							</Row>
						</div>
						<div className='detailCard'>
							<Table
								bordered
								dataSource={dataSource}
								title={() => '产品信息'}
								scroll={{ x: 1950 }}
								columns={columns}
								rowKey={'batchNo'}
								pagination={{
									size: 'small',
									showQuickJumper: true,
									showSizeChanger: true
								}}
							/>
					</div>
				</div>
			</Spin>
			)
	}
}
export default connect(state => state )(RecallAndLockedDetail) ;