import React from 'react';
import { Select} from 'antd';
import querystring from 'querystring';
const Option = Select.Option;

let timeout;
let currentValue;

function fake(value, callback, url, query) {
  
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;
   fetch(url + '?searchName=' + value + '&' + querystring.stringify(query), {
        method: 'get',
        mode:'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
    })
    .then(response => {
      return response.json();
    })
    .then(d => {
        if (currentValue === value) {
          let result = d;
          const data = [];
          result.forEach((r) => {
            data.push({
              value: r.value.toString(),
              text: r.text,
            });
          });
          callback(data);   
        }
    })
    .catch(e => console.log("Oops, error", e))

}




class MultipleSelect extends React.Component {
  state = {
    data: [],
    value: '',
  }
 
  getValues = (value) => {
    this.props.cb(value);
  }
  handleChange = (value) => {
    this.setState({ value });
    fake(value, data => this.setState({ data }), this.props.url, this.props.query);
  }
  render() {
    const options = this.state.data.map(d => <Option value={d.value} key={d.value}>{d.text}</Option>);
    return (
      <Select
        mode='multiple'
        showSearch
        defaultValue={this.props.defaultValue}
        onSearch={this.handleChange}
        onChange={this.getValues}
        notFoundContent="暂无查询结果"
        style={this.props.style}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        disabled={this.props.disabled}
        placeholder={this.props.placeholder}
      >
        {options}
      </Select>
    );
  }
}

export default MultipleSelect;