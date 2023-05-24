import { showErrorMessage, showSuccessMessage } from '@/utils/common.utils';
import { Button, Col, Collapse, Form, Input, Row } from 'antd';
import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { getToken } from '../service';

const FormItem = Form.Item,
  Panel = Collapse.Panel;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};
const formItemLayoutName = {
  labelCol: { span: 3 },
  wrapperCol: { span: 6 },
};
const EditAzure: React.FC = () => {
  const [formBasic] = Form.useForm();
  const [formSyncPolicy] = Form.useForm();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const [token, setTokenValue] = useState('');

  const onGetToken = async () => {
    const dataObj = await formBasic.validateFields();
    setLoading(true);
    getToken(dataObj)
      .then((res) => {
        setLoading(false);
        setTokenValue(res);
        showSuccessMessage('token' + res, 0);
      })
      .catch((error) => {
        setLoading(false);
        showErrorMessage(error);
      });
  };
  const renderBasicForm = () => {
    return (
      <Panel header="基础配置" key="base">
        <Form form={formSyncPolicy} {...formItemLayout}>
          <Row>
            <Col span="24">
              <FormItem
                name=""
                label="名称"
                initialValue=""
                rules={[{ required: true, message: '请输入' }]}
                {...formItemLayoutName}
              >
                <Input />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem name="Tenant ID" label="Tenant ID" initialValue={''}>
                <Input type="text" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                name="Client ID"
                label="Client ID"
                initialValue={''}
                rules={[{ required: true, message: '请输入' }]}
              >
                <Input />
              </FormItem>
            </Col>

            <Col span="12">
              <FormItem
                name="Client Secret "
                label="Client Secret"
                initialValue={''}
                rules={[{ required: true, message: '请输入' }]}
              >
                <Input type="text" />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="3" style={{ textAlign: 'end' }}>
              <Button type="link" onClick={onGetToken}>
                获取token
              </Button>
            </Col>
            <Col>
              <Input value={token} readOnly />
            </Col>
          </Row>
        </Form>
      </Panel>
    );
  };

  //用户必填
  const render = () => {
    return (
      <PageContainer title={false}>
        <div id="content" className="content">
          <Collapse defaultActiveKey={['base']} bordered={false}>
            {renderBasicForm()}
          </Collapse>
        </div>
      </PageContainer>
    );
  };
  return render();
};

export default EditAzure;
