/*jshint esversion: 6 */
import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

const FormItem = Form.Item;

class DynamicFieldSet extends Component {
  constructor(...args) {
    super(...args);
    this.tmplArr = [];
    this.state = {
      keys: [],
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const nextDataArr = nextProps.dataArr;
    if (nextDataArr.length !== this.props.dataArr.length) {
      this.uuid = nextDataArr ? nextDataArr.length : 0;
      this.tmplArr = nextDataArr?.map((item, index) => ({ key: index, value: item }));
      this.setState({
        keys: this.tmplArr?.length === 0 ? [0] : this.tmplArr?.map((item) => item.key),
      });
    }
  }

  componentDidMount() {
    const nextDataArr = this.props.dataArr;
    this.uuid = nextDataArr ? nextDataArr.length : 0;
    this.tmplArr = nextDataArr?.map((item, index) => ({ key: index, value: item }));
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
    this.tmplArr = this.tmplArr.filter((item) => item.key !== k);
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
      const item = this.tmplArr.find((item1) => item1.key === k);
      return (
        <div key={index}>
          <FormItem
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            label={index === 0 ? this.props.label : ''}
            key={k}
            name={`uris-${k}`}
            colon={this.props.col ? true : false}
            // colon={false}
            initialValue={(item && item.value) || ''}
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
        </div>
      );
    });

    const formItems_Edit = this.state.keys.map((k, index) => {
      // return <h1 key={index}>22</h1>
      const item = this.tmplArr.find((item1) => item1.key === k);
      return (
        <div key={index}>
          <FormItem
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            label={index === 0 ? this.props.label : ''}
            key={index}
            name={`uris-${k}`}
            colon={this.props.col ? true : false}
            initialValue={(item && item.value) || ''}
            rules={[
              {
                validator: async (_, names) => {
                  const regExp =
                    /^(?:(?:1[0-9][0-9]\.)|(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:1[0-9][0-9])|(?:2[0-4][0-9])|(?:25[0-5])|(?:[1-9][0-9])|(?:[0-9])|(\*))$/;
                  const variable = names;
                  if (!names.trim()) {
                    return Promise.resolve();
                  }
                  if (!regExp.test(variable)) {
                    return Promise.reject(new Error('免锁定IP白名单不符合要求'));
                  }
                },
              },
            ]}
          >
            <Input
              style={{ width: '93%', marginRight: 8 }}
              addonAfter={
                this.state.keys.length > 1 ? (
                  <MinusOutlined
                    key={index}
                    disabled={this.state.keys.length === 1}
                    onClick={() => this.remove(k)}
                  />
                ) : null
              }
            />
          </FormItem>
        </div>
      );
    });

    return (
      <div>
        {this.props.isShowAdress ? (
          ''
        ) : (
          <FormItem label="服务发现地址: " labelCol={{ span: 4 }}>
            <span>
              {location.protocol +
                '//' +
                location.host +
                `/iam/oidc/${this.props.clientID_ls}/.well-known/openid-configuration`}
            </span>
          </FormItem>
        )}
        {this.props.isShowAdress ? formItems_Edit : formItems}
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
