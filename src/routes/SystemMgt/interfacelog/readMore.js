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



class AddRefund extends PureComponent{
    constructor(props){
        super(props)
        this.state={
            visible: false,
            tabArr:'',

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
        if(e){
            e.stopPropagation()
        }
        this.setState({
            visible:true,
            tabArr:this.props.record
        })
        console.log(this.state.tabArr)
    }

    render(){
        let { visible, display,druglist,tabArr,tabKey,defaultKey} = this.state;



        return (
            <span onClick={this.showModal} >

                <Modal
                    destroyOnClose
                    bordered
                    title={'详情'}
                    width={1200}
                    style={{ top: 50 }}
                    visible={visible}
                    okText={'确定'}
                    onOk={this.cancel}
                >
                    <div>

                    </div>

                </Modal>
            </span>
        )
    }
}
export default connect(state => state)(Form.create()(AddRefund));