/*jshint esversion: 6 */
import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

const FormItem = Form.Item;

class DynamicFieldSet extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      keys: [],
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const dataArr = this.props.dataArr;
    this.uuid = dataArr ? dataArr.length : 0;
    this.tmplArr = dataArr.map((item, index) => ({ key: index, value: item }));

    const nextDataArr = nextProps.dataArr;
    if (nextDataArr.length !== this.props.dataArr.length) {
      this.uuid = nextDataArr ? nextDataArr.length : 0;
      this.tmplArr = nextDataArr.map((item, index) => ({ key: index, value: item }));
      this.setState({
        keys: this.tmplArr?.length === 0 ? [0] : this.tmplArr?.map((item) => item.key),
      });
    }
  }

  componentDidMount() {
    const nextDataArr = this.props.dataArr;

    this.uuid = nextDataArr ? nextDataArr.length : 0;
    this.tmplArr = nextDataArr.map((item, index) => ({ key: index, value: item }));

    this.setState({
      keys: this.tmplArr?.length === 0 ? [0] : this.tmplArr?.map((item) => item.key),
    });
  }

  remove(k) {
    if (this.state.keys.length === 1) {
      return;
    }
    this.setState({
      keys: this.state.keys.filter((key) => key !== k),
    });
    this.tmplArr = this?.tmplArr?.filter((item) => item.key !== k);
  }

  add() {
    this.uuid++;
    this.setState({
      keys: this.state.keys.concat(this.uuid),
    });
  }

  render() {
    const { labelSpan, wrapperSpan } = this.props;
    const formItemLayout = {
      labelCol: {
        span: labelSpan,
      },
      wrapperCol: {
        span: wrapperSpan,
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        span: wrapperSpan,
        offset: labelSpan,
      },
    };
    const formItems = this.state.keys.map((k, index) => {
      const item = this.tmplArr?.find((item1) => item1.key === k);
      return (
        <>
          <FormItem
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            label={index === 0 ? this.props.label : ''}
            // required={true}
            key={k}
            name={`urisss-${k}`}
            initialValue={(item && item.value) || ''}
            // rules={validator.isRedirectUri(this.props.appType)} todo
          >
            <Input
              style={{ width: '93%', marginRight: 8 }}
              addonAfter={
                this.state.keys.length > 1 ? (
                  <MinusOutlined
                    disabled={this.state.keys.length === 1}
                    onClick={() => this.remove(k)}
                  />
                ) : null
              }
            />
          </FormItem>
        </>
      );
    });
    return (
      <div>
        <FormItem label="CAS Login URL: " labelCol={{ span: 4 }}>
          <span>
            {location.protocol + '//' + location.host + `/iam/cas/${this.props.clientID_ls}/login`}
          </span>
        </FormItem>

        {formItems}
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add.bind(this)} style={{ width: '93%' }}>
            <PlusOutlined />
            添加
          </Button>
        </FormItem>
      </div>
    );
  }
}

export default DynamicFieldSet;
