/**
 * Created by Vania on 2018-05-30
 */
import React, { PureComponent } from 'react';
import { Form, Input, InputNumber } from 'antd';
const FormItem = Form.Item;
/**
 * @description EditableRow Component
 * @private
 * @param {object} { form, index, rest }
 * @returns EditableContext Component
 */
const EditableContext = React.createContext();
@Form.create()
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props}/>
  </EditableContext.Provider>  
)

/**
 * EditableCell class
 * @class
 * @param 
 * @returns {EditableCell Component}
 */
class EditableCell extends PureComponent {
  /**
   * @constructor
   * @param {*} props 
   */
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  /**
   * @function
   * @deprecated 根据条件生成InputNumber Component 或者 Input Component
   * @returns Component
   */
  getInput = () => this.props.inputType === 'number' ? <InputNumber /> : <Input />
  render() {
    const { editing, dataIndex, title, inputType, record, index, ...restProps } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `Please Input ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    )
  }
}

export default EditableCell;