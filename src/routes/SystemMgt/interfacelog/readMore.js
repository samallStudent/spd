/**
 * @author QER
 * @date 19/2/27
 * @Description: 接口监控－xml／json详情
*/
import React, { PureComponent } from 'react';
import { Table , Col, Button, Icon, Modal , message, Input , Row , Tooltip, Spin, Form, Select,} from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'dva';
import * as convert from 'xml-js'
import ReactJson from 'react-json-view'


class AddRefund extends PureComponent{
    constructor(props){
        super(props)
        this.state={
            visible: false,
            tabArr:'',
            jsonArr:''

        }
    }

    //取消


    cancel=e=>{
        if(e){
            e.stopPropagation()
        }
        this.setState({
            visible:false
        });

    }

    componentDidMount=()=>{


}
    showModal=e=>{
        let { tabArr} = this.state;

        if(e){
            e.stopPropagation()
        }
        this.setState({
            visible:true
        })

    }

    render(){
        let { visible,tabArr} = this.state;
        return (
            <span onClick={this.showModal} >
                {this.props.children}
                <Modal
                    destroyOnClose
                    bordered
                    title={'参数详情'}
                    width={770}
                    style={{ top:'50%' ,marginTop:'-260px'}}
                    visible={visible}
                    onCancel={this.cancel}
                    footer={null}
                >
                    <div style={{height:'400px',overflow:'auto'}}>
                    <ReactJson src={this.props.record} />
                    </div>

                </Modal>
            </span>
        )
    }
}
export default connect(state => state)(Form.create()(AddRefund));