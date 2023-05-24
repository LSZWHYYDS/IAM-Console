import { Card, Col, Form, Input, Row } from 'antd';
import React from 'react';
import FeishuDesc from './FeishuDesc';

const FormItem = Form.Item;

const FeiShu: React.FC<any> = (props: any) => {
  const render = () => {
    const { data = {} } = props;
    const config = (data.config && JSON.parse(data.config)) || {};
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    return (
      <Card key="ddParam">
        <FeishuDesc height={200} />
        <Row>
          <Col span="24">
            <FormItem
              name="name"
              label="名称"
              initialValue={config.name || ''}
              rules={[{ required: true }]}
              {...formItemLayout}
            >
              <Input type="text" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem
              name="app_key"
              label="AppKey"
              initialValue={config.app_key || ''}
              rules={[{ required: true, min: 1, max: 20 }]}
              {...formItemLayout}
            >
              <Input type="text" />
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem
              name="app_secret"
              label="AppSecret"
              initialValue={config.app_secret || ''}
              rules={[{ required: true, min: 1, max: 64 }]}
              {...formItemLayout}
            >
              <Input type="text" />
            </FormItem>
          </Col>
        </Row>
      </Card>
    );
  };
  return render();
};
export default FeiShu;
