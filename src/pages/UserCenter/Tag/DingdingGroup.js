/*jshint esversion: 6 */
import React, { Component } from 'react';
import { Form, Button, Card, Input, Radio } from 'antd';
import { filterDangerousChars, showErrorMessage, showSuccessMessage } from '@/utils/common.utils';
import tagAPI from '../tagAPI';
const FormItem = Form.Item;

class DingdingGroup extends Component {
  constructor(...args) {
    super(...args);
    this.tagId = this.props.tagId;
    this.state = {
      data: {},
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    filterDangerousChars();
    if (this.tagId) {
      tagAPI.getTag(this.tagId).then((response) => {
        if (response) {
          const tagInfo = response.data;
          this.setState({
            data: tagInfo,
          });
          this.formRef.current.setFieldsValue(tagInfo);
        }
      });
    }
  }
  onSubmit = (values) => {
    tagAPI.createConversation(this.tagId, values).then(
      () => {
        showSuccessMessage();
        this.props.onClose();
      },
      (error) => {
        showErrorMessage(error);
      },
    );
  };
  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <Card>
        <Form
          className="formPadding"
          layout="horizontal"
          ref={this.formRef}
          onFinish={this.onSubmit}
        >
          <FormItem
            label="群聊名称"
            {...formItemLayout}
            name="name"
            initialValue={this.state.data.name ? this.state.data.name : ''}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type="text" readOnly={!!this.state.data.name} />
          </FormItem>
          <FormItem
            label="描述"
            name="description"
            {...formItemLayout}
            initialValue={this.state.data.description ? this.state.data.description : ''}
          >
            <Input type="text" />
          </FormItem>
          <FormItem
            label="群管理员"
            {...formItemLayout}
            name="owner"
            initialValue={this.state.data.owner ? this.state.data.owner : ''}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type="text" />
          </FormItem>
          <FormItem label="入群验证" name="validation_type" {...formItemLayout} initialValue={1}>
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem label="群管理类型" name="management_type" {...formItemLayout} initialValue={1}>
            <Radio.Group>
              <Radio value={1}>所有人可管理</Radio>
              <Radio value={0}>仅群主可管理</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem
            label="是否开启群禁言"
            name="chat_banned_type"
            {...formItemLayout}
            initialValue={1}
          >
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          </FormItem>
          <div className="footerContainer">
            <Button type="primary" htmlType="submit">
              保存
            </Button>
            <Button type="ghost" className="ml-10" onClick={this.props.onClose}>
              取消
            </Button>
          </div>
        </Form>
      </Card>
    );
  }
}

export default DingdingGroup;
