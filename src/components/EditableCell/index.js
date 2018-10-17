import React, { PureComponent } from 'react';
import { Input, Icon, message } from 'antd';
class EditableCell extends PureComponent {
  state = {
    value: this.props.value,
    record: this.props.record,
    index: this.props.index,
    columns: this.props.columns,
    editable: false,
    max:this.props.max
  }
  static getDerivedStateFromProps(nextProps, prevState){
    if(prevState.value !== nextProps.value && !prevState.editable){
      return {
        value: nextProps.value,record: nextProps.record
      }
    }
    return null;
  }
  handleChange = (e) => {
    if(this.props.validate){
      let { rules } = this.props;
      let { rule, errorMsg } = rules;
      if(!rule.test(e.target.value)){
        return message.warning(errorMsg)
      }
    }
    const value = e.target.value;
    this.setState({ value });
  }
  
  check = () => {
    if(this.state.value.length>this.state.max){
        return  message.warning('字符长度不能超过'+this.state.max);
    };
    this.setState({ editable: false });
    const { value, record, columns } = this.state;
    console.log(columns,'EditCell columns')
    this.props.onEditChange(value, record, columns);
  }
  edit = () => {
    this.setState({ editable: true });
  }
  render() {
    const { max ,value, editable } = this.state;
    return (
      <div className="editable-cell">
        {
          editable ?
            <div className="editable-cell-input-wrapper">
              <Input
                style={{ width: this.props.width || '85%' }}
                value={value}
                max={max}
                onChange={this.handleChange}
                onPressEnter={this.check}
              />
              <Icon
                type="check"
                className="editable-cell-icon-check"
                onClick={this.check}
              />
            </div>
            :
            <div className="editable-cell-text-wrapper">
              {value || ' '}
              <Icon
                type="edit"
                className="editable-cell-icon"
                onClick={this.edit}
              />
            </div>
        }
      </div>
    );
  }
}
export default EditableCell;