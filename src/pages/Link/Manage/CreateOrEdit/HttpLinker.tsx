import { Col, Form, Input, Radio, Row, Select } from 'antd';
import { Fragment, useState, useImperativeHandle, forwardRef } from 'react';
import _ from 'lodash';
import ImageUploader from '@/components/ImageUploader';
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};
const formLayoutPng = {
  labelCol: { span: 10 },
  wrapperCol: { span: 12 },
};

const HttpLinker = (props: any, ref) => {
  const [formBasic] = Form.useForm();
  const [data, setData] = useState<any>(props.data || {});

  const getFormData = () => {
    const basicData = data;
    //如果放到header就传true，否则传false
    const add_to_header = _.get(basicData, 'api_key_auth.add_to_header');
    if (add_to_header === 'header') {
      basicData.api_key_auth.add_to_header = true;
    } else if (add_to_header === 'query_params') {
      basicData.api_key_auth.add_to_header = false;
    }
    return basicData;
  };

  useImperativeHandle(ref, () => ({
    getData: () => {
      return getFormData();
    },
    getDataOnSave: async () => {
      const formData = await formBasic.validateFields();
      const add_to_header = _.get(formData, 'api_key_auth.add_to_header');
      if (add_to_header === 'header') {
        formData.api_key_auth.add_to_header = true;
      } else if (add_to_header === 'query_params') {
        formData.api_key_auth.add_to_header = false;
      }
      return formData;
    },
    setData: () => {
      setData(props.data);
      return formBasic.setFieldsValue(props.data);
    },
  }));

  const onFieldsChange = (changedFields: any, allFields: any) => {
    setData(allFields);
  };
  const renderAuth = () => {
    const { auth_type = 'HTTP_BASIC' } = data || {};
    switch (auth_type) {
      case 'HTTP_BASIC':
        return (
          <Fragment>
            <Col span="24">
              <FormItem
                name={['basic_auth', 'username']}
                label="用户名"
                rules={[{ required: true, message: '请输入' }]}
                {...formItemLayout}
              >
                <Input type="text" />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem
                name={['basic_auth', 'password']}
                label="密码"
                rules={[{ required: true, message: '请输入' }]}
                {...formItemLayout}
              >
                <Input.Password />
              </FormItem>
            </Col>
          </Fragment>
        );
      case 'BEARER_TOKEN':
        return (
          <Col span="24">
            <FormItem
              name={['bearer_token_auth', 'token']}
              label="Token"
              rules={[{ required: true, message: '请输入' }]}
              {...formItemLayout}
            >
              <Input type="text" />
            </FormItem>
          </Col>
        );
      case 'API_KEY':
        return (
          <Fragment>
            <Col span="24">
              <FormItem
                name={['api_key_auth', 'key']}
                label="Key"
                rules={[{ required: true, message: '请输入' }]}
                {...formItemLayout}
              >
                <Input type="text" />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem
                name={['api_key_auth', 'value']}
                label="Value"
                rules={[{ required: true, message: '请输入' }]}
                {...formItemLayout}
              >
                <Input type="text" />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem
                name={['api_key_auth', 'add_to_header']}
                label="放到"
                rules={[{ required: true, message: '请输入' }]}
                {...formItemLayout}
              >
                <Select
                  options={[
                    {
                      label: 'Header',
                      value: 'header',
                    },
                    {
                      label: 'Query Params',
                      value: 'query_params',
                    },
                  ]}
                />
              </FormItem>
            </Col>
          </Fragment>
        );
      case 'OAUTH2_CLIENT':
        return (
          <Fragment>
            <Col span="24">
              <FormItem
                name="grant_type"
                label="Grant Type"
                initialValue="Client Credentials"
                rules={[{ required: true, message: '请输入' }]}
                {...formItemLayout}
              >
                <Input type="text" disabled />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem
                name={['oauth2_auth', 'auth_method']}
                label="Client Authentication"
                {...formItemLayout}
                rules={[{ required: true, message: '请输入' }]}
              >
                <Select
                  options={[
                    {
                      value: 'client_secret_basic',
                      label: 'Client Secret Basic',
                    },
                    {
                      value: 'client_secret_post',
                      label: 'Client Secret Post',
                    },
                  ]}
                  allowClear
                />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem
                name={['oauth2_auth', 'client_id']}
                label="Client ID"
                rules={[{ required: true, message: '请输入' }]}
                {...formItemLayout}
              >
                <Input type="text" />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem
                name={['oauth2_auth', 'client_secret']}
                label="Client Secret"
                rules={[{ required: true, message: '请输入' }]}
                {...formItemLayout}
              >
                <Input type="text" />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem
                name={['oauth2_auth', 'endpoint']}
                label="Access Token URL"
                rules={[{ required: true, message: '请输入' }]}
                {...formItemLayout}
              >
                <Input type="text" />
              </FormItem>
            </Col>
          </Fragment>
        );
        break;
      default:
        return null;
    }
  };
  const renderBasicForm = () => {
    const preValue = {
      ...props.data,
    };
    if (!preValue.auth_type) {
      preValue.auth_type = 'HTTP_BASIC';
    }
    return (
      <Form form={formBasic} initialValues={preValue} onValuesChange={onFieldsChange}>
        <Row>
          <Col span="17">
            <Row>
              <Col span="24">
                <FormItem
                  name="http_host"
                  label="接口域名"
                  rules={[{ required: true, message: '请输入' }]}
                  {...formItemLayout}
                >
                  <Input type="text" />
                </FormItem>
              </Col>
              <Col span="24">
                <FormItem
                  name="auth_type"
                  label="鉴权方式"
                  // initialValue={'HTTP_BASIC'}
                  rules={[{ required: true, message: '请输入' }]}
                  {...formItemLayout}
                >
                  <Radio.Group>
                    <Radio value="HTTP_BASIC">Basic Auth</Radio>
                    <Radio value="OAUTH2_CLIENT">OAuth 2.0</Radio>
                    <Radio value="BEARER_TOKEN">Bearer Token</Radio>
                    <Radio value="API_KEY">API Key</Radio>
                    <Radio value="NO_AUTH">无鉴权</Radio>
                  </Radio.Group>
                </FormItem>
              </Col>
              {renderAuth()}
            </Row>
          </Col>
          <Col span="7">
            <FormItem label="连接器图标(50k以下)" name="icon" shouldUpdate {...formLayoutPng}>
              <ImageUploader maxSize={50} onChange={() => {}} />
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };
  const render = () => {
    return <div id="content">{renderBasicForm()}</div>;
  };
  return render();
};

export default forwardRef(HttpLinker);
