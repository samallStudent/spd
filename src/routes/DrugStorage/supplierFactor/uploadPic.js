/*
 * @Author: yuwei  退货新建 /refund/add
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Table , Col, Button, Icon, Modal , message, Input , Row , Tooltip, Spin, Form, Select,Upload ,DatePicker} from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'dva';
import { _local } from '../../../api/local';
//import { outStorage } from '../../../api/drugStorage/outStorage';
class PicturesWall extends PureComponent{
  constructor(props){
    super(props)
    this.state={
        previewVisible: false,
        previewImage: '',
        length: this.props.length,
        maxFileSize: this.props.maxFileSize ? this.props.maxFileSize : 5,
        fileList: this.props.value instanceof Array ? this.props.value : [],

        action:`${_local}/public/file/upload`,
        appid:'',
        secret: '',
        imageHead:''
    }
  }

//关闭预览
    handleCancel = () => {
        this.setState({previewVisible: false});
    };
//查看预览
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };
//处理图片更新
    handleChange = (e) => {
        let fileList = this.handleUpload(e);
        this.props.onChange(fileList);
        console.log(fileList)
    };
//处理更新
    handleUpload = (e) => {
        let fileList = e.fileList.map(file => {
            if (file.response) {
                //这个地方是上传结束之后会调用的方法，这边是判断success!!!
                if (file.response.success) {
                    return this.filter(file);
                }
            }
            return file;
        });
        this.setState({fileList: fileList});
        return fileList;

    };
//过滤服务器返回的数据
    filter = (file) => {
        const {name, response, uid, status} = file;
        return {name, url: response.data, uid, status};
    };
//限制
    beforeUpload = (file) => {
        const maxFileSize = this.state.maxFileSize;
        if (maxFileSize) {
            const isLtMax = file.size / 1024 / 1024 < maxFileSize;
            if (!isLtMax) {
                message.error(`文件大小超过${maxFileSize}M限制`);
            }
            return isLtMax;
        }
    };


  render(){
      const {previewVisible, previewImage, appid, secret} = this.state;
      let fileList = this.state.fileList;

      const uploadButton = fileList.length >= this.props.length ? null : (
          <div style={{width:'270px'}}>
              <Icon type="plus"/>
              <div className="ant-upload-text">选择本地图片文件上传</div>
          </div>
      );
      const props = {
          action: this.state.action,
          fileList: fileList,
          data: {
              appid: appid,
              secret: secret,
          },
          headers: {'X-Requested-With': null},
          // accept: "image/*",
          accept: "image/jpg,image/jpeg,image/png,image/bmp",
          onChange: this.handleChange,
          beforeUpload: this.beforeUpload,
          onPreview: this.handlePreview,
          listType: "picture-card",
      };

    return (
    <div>
        <Upload
            {...props}  >
            {fileList.length >= this.state.length ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
    </div>
    )
  }
}
export default connect(state => state)(PicturesWall);