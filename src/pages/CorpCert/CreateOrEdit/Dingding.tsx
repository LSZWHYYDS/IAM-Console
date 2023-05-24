import { Checkbox, Col, Form, Input, Row } from 'antd';
import React from 'react';
import DingdingDesc from './DingdingDesc';

const FormItem = Form.Item;
const Dingding: React.FC<any> = (props) => {
  const process_enableValue = Form.useWatch('process_enable', props.form);
  const render = () => {
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
    };
    return (
      <div key="ddParam">
        <DingdingDesc height={120} />
        <Row gutter={[0, 10]}>
          <Col span="24">
            <FormItem name="name" label="名称" rules={[{ required: true }]} {...formItemLayout}>
              <Input type="text" />
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem
              name="corp_id"
              label="CorpID"
              rules={[{ required: true, min: 1, max: 36 }]}
              {...formItemLayout}
            >
              <Input type="text" />
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem
              name="agent_id"
              label="AgentID"
              rules={[{ required: true, min: 1, max: 10 }]}
              {...formItemLayout}
            >
              <Input type="text" />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[0, 10]} style={{ marginTop: 10 }}>
          <Col span="24">
            <FormItem
              name="app_key"
              label="AppKey"
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
              rules={[{ required: true, min: 1, max: 64 }]}
              {...formItemLayout}
            >
              <Input type="text" />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[0, 10]}>
          <Col span="24">
            <FormItem
              name="process_enable"
              label="启用钉钉审批流"
              {...formItemLayout}
              valuePropName="checked"
            >
              <Checkbox />
            </FormItem>
          </Col>
        </Row>
        {(process_enableValue && (
          <Row gutter={[0, 10]}>
            <Col span="24">
              <FormItem name="account_process_config" label="用户开通审批" {...formItemLayout}>
                <Input placeholder="请输入钉钉对应审批流的唯一码(processCode)" />
              </FormItem>
            </Col>
          </Row>
        )) ||
          null}
        {(process_enableValue && (
          <Row gutter={[0, 10]}>
            <Col span="24">
              <FormItem name="app_process_config" label="应用申请审批" {...formItemLayout}>
                <Input placeholder="请输入钉钉对应审批流的唯一码(processCode)" />
              </FormItem>
            </Col>
          </Row>
        )) ||
          null}
      </div>
    );
  };
  return render();
};
export default Dingding;
