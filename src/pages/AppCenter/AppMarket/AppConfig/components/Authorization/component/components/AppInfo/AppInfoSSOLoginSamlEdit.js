/**
 */
/*jshint esversion: 6 */
import React, { Component } from 'react';
import { Modal, Button, Form, Select, Input } from 'antd';

const Option = Select.Option,
  FormItem = Form.Item;

class AppInfoSSOLoginSamlEdit extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      newAttr: Object.assign({}, this.props.oldAttr),
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.oldAttr) {
      //edit attr
      this.setState({
        newAttr: Object.assign({}, nextProps.oldAttr),
      });
    } else {
      //new attr
      this.setState({
        newAttr: Object.assign({}, {}),
      });
    }
  }

  onSelectChange(fieldName, value) {
    let newAttr = Object.assign(this.state.newAttr, {});
    newAttr[fieldName] = value;
    this.setState({ newAttr });
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const { attribute_format, attribute_value = null, attribute_name } = this.state.newAttr;
    return (
      <div>
        <Modal
          title={this.state.newAttr.domain_name ? '编辑' : '添加'}
          closable={false}
          open={this.props.showModal}
          footer={[
            <Button
              key="cancel"
              size="large"
              onClick={() => {
                this.props.switchModal(false, null, null);
              }}
            >
              取消
            </Button>,
            <Button
              key="save"
              size="large"
              type="primary"
              onClick={() => {
                this.props.switchModal(false, this.state.newAttr, this.props.oldAttr);
              }}
            >
              确定
            </Button>,
          ]}
        >
          <FormItem label="属性名" {...formItemLayout}>
            <Input
              value={attribute_name}
              style={{ width: '300px' }}
              onChange={(e) => {
                const { value } = e.target;
                this.onSelectChange('attribute_name', value);
              }}
            />
          </FormItem>
          <FormItem label="属性格式" {...formItemLayout}>
            <Select
              value={attribute_format}
              allowClear={true}
              style={{ width: '300px' }}
              onSelect={(value) => {
                this.onSelectChange('attribute_format', value);
              }}
            >
              <Option key="none" value="none">
                不指定
              </Option>
              <Option key="ref_url" value="ref_url">
                引用URL
              </Option>
              <Option key="base_info" value="base_info">
                基础信息
              </Option>
            </Select>
          </FormItem>
          <FormItem label="属性值" {...formItemLayout}>
            <Select
              value={attribute_value}
              allowClear={true}
              style={{ width: '300px' }}
              onSelect={(value) => {
                this.onSelectChange('attribute_value', value);
              }}
            >
              <Option key="user.firstName" value="user.firstName">
                user.firstName
              </Option>
              <Option key=" user.lastName" value=" user.lastName">
                user.lastName
              </Option>
              <Option key="user.email" value="user.email">
                user.email
              </Option>
              <Option key=" user.login" value=" user.login">
                user.login
              </Option>
              <Option key="device.trusted" value="device.trusted">
                device.trusted
              </Option>
            </Select>
          </FormItem>
        </Modal>
      </div>
    );
  }
}

export default AppInfoSSOLoginSamlEdit;
