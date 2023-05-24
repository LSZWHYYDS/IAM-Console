/*jshint esversion: 6 */
import React, { Component } from 'react';
import { Select, Spin } from 'antd';
import { incsearch } from '@/services/userMgrAPI';

const Option = Select.Option;

class IncsearchUser extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      data: [],
      fetching: false,
      selections: [],
    };
    this.handleSearch('');
  }

  clear() {
    //todo? how?
  }

  fetch(value, callback) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.currentValue = value;

    const search = () => {
      const api = incsearch(value);
      this.setState({ fetching: true });

      api.then(
        (response) => {
          if (this.currentValue === value) {
            const handleId = (sub) => this.state.selections.includes(sub);
            const baseIdFilterSelectObject = response.data.items.filter(({ sub }) => handleId(sub));
            const baseIdFilterSelectLabel = baseIdFilterSelectObject?.map(
              (selectObject) => selectObject.username,
            );
            this.setState({
              selections: baseIdFilterSelectLabel,
            });
            callback(response.data.items);
          }
        },
        () => {
          if (this.currentValue === value) {
            callback([]);
          }
        },
      );
    };

    this.timeout = setTimeout(search, 300);
  }

  handleSearch(value) {
    this.setState({ value });
    this.fetch(value, (data) => {
      this.setState({
        fetching: false,
        data: data ? data : [],
      });
    });
  }

  handleChange(value, option) {
    this.setState({
      selections: value,
    });

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  getSelections() {
    return this.state.selections;
  }

  setSelections(selections) {
    this.setState({
      selections: selections,
    });
  }

  clearSelections() {
    this.setState({
      selections: [],
    });
  }

  makeOptions() {
    const { data } = this.state;
    return data.map(this.makeOption.bind(this));
  }

  makeOption(entry) {
    const keyName = this.props.optionKey,
      key = entry[keyName];

    return (
      <Option key={key} title={entry.name || entry.username} sub={entry?.sub}>
        <img
          src={entry.picture || `/uc/images/default-avatar.png`}
          style={{ verticalAlign: 'middle', width: '30px', height: '30px' }}
        />
        <span
          style={{ display: 'inline-block', marginLeft: '10px' }}
          title={entry.name || entry.username}
        >
          {`${entry.name || entry.username}`}
        </span>
      </Option>
    );
  }

  render() {
    const { labelInValue } = this.props;
    const options = this.makeOptions(),
      { fetching } = this.state;
    return (
      <Select
        mode="multiple"
        defaultValue={this.state.selections}
        value={this.state.selections}
        labelInValue={labelInValue === undefined || labelInValue}
        filterOption={false}
        allowClear={true}
        placeholder={this.props.placeholder}
        notFoundContent={fetching ? <Spin size="large" /> : '没有找到匹配'}
        onSearch={this.handleSearch.bind(this)}
        onChange={this.handleChange.bind(this)}
        size="large"
        style={this.props.style}
        ref={(input) => {
          this.userinput = input;
        }}
      >
        {options}
      </Select>
    );
  }
}

IncsearchUser.defaultProps = {
  placeholder: '添加用户',
  style: { width: '100%' },
  optionKey: 'sub',
};

export default IncsearchUser;
