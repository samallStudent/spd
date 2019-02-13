/**
 * @author QER
 * @date 19/1/9
 * @Description: 证照预览
 */
import React, { PureComponent } from 'react';
import {  Button,  Modal,Carousel} from 'antd';
import { Link } from 'react-router-dom';

import { connect } from 'dva';

class AddRefund extends PureComponent{
    constructor(props){
        super(props)
        this.state={
            visible:false,
            current:90,
            transStyle:''
        }
    }


    //取消


    cancel=e=>{
        if(e){
            e.stopPropagation()
        }
        this.setState({
            visible:false,
            current:90,
            transStyle:'rotate('+0+'deg)'
        })
    }



    render(){
        let { visible} = this.state;
        const {children}=this.props;
        //let pic = JSON.parse(this.props.record);
        let pic=this.props.record
        let imgArr=[]
        if(pic){
            pic.forEach(function (value,index,arr) {
                imgArr.push(JSON.parse(value.pictcontent))
            });
        }
        console.log(imgArr)
        return (
            <span  onClick={()=>{this.setState({visible:true});}}>
        {children}
                <Modal
                    destroyOnClose
                    bordered
                    width={500}
                    style={{ top: 20 }}
                    onCancel={this.cancel} visible={visible}
                    height={500}
                    footer={null}
                >
        <div className='preview-list'>
            {
                pic?
                    <Carousel >


                        {
                            imgArr.map((item,index)=><div><img  width='500' height='560' key={index} src={`${item.original.path}${item.original.name}`} alt=""/></div> )
                        }

                    </Carousel>:'暂未上传资质图片'
            }

        </div>

        </Modal>
    </span>
        )
    }
}
export default connect(state => state)(AddRefund);