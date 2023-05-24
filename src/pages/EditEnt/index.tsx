/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Spin, Row, Input, Collapse, Col, Checkbox, Form, Button, Card, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { snsList, getSns, updateSns, createSns } from './service';
import type { EntInfo } from './data';

const { Panel } = Collapse;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

const EditEnt: React.FC = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [entInfo, setEntInfo] = useState<EntInfo>({
    name: '',
    type: '',
    corp_id: '',
    agent_id: '',
    app_key: '',
    app_secret: '',
    api_base_url: '',
  });
  const [entId, setEntId] = useState('');
  const loadData = async () => {
    setIsLoading(true);
    return await snsList().then(async (res) => {
      const { items = [] } = res.data;
      if (items.length) {
        const item = items[0] || {};
        setEntId(item.id);
        await getSns(item.id).then(async (res1) => {
          const entData = JSON.parse(res1.data.config);
          entData.name = res1.data.name;
          setEntInfo(entData);
          form.setFieldsValue(entData);
        });
      }
      setIsLoading(false);
      return res;
    });
  };
  useEffect(() => {
    loadData();
  }, []);
  const onSubmit = async () => {
    const values = form.getFieldsValue();
    values.type = typeof values.type === 'string' ? values.type : values.type.join();
    const params = {
      config: {
        corp_id: values.corp_id.trim(),
        agent_id: values.agent_id.trim(),
        app_key: values.app_key.trim(),
        app_secret: values.app_secret.trim(),
        api_base_url: values.api_base_url.trim(),
      },
      corp_id: values.corp_id.trim(),
      default: true,
      name: values.name.trim(),
      type: values.type.trim(),
    };
    if (entId) {
      await updateSns(entId, params).then(async () => {
        message.success('保存成功。');
      });
    } else {
      await createSns(params).then(async () => {
        message.success('保存成功。');
      });
    }
  };
  const render = () => {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    return (
      <PageContainer title={false}>
        <Spin
          spinning={isLoading}
          style={{
            position: 'fixed',
            left: '55%',
            top: '48%',
            height: 0,
            width: 0,
          }}
        >
          <div>
            <Form form={form} {...formItemLayout}>
              <Collapse defaultActiveKey={['base', 'ddParam', 'wwParam']} bordered={false}>
                <Panel header="基本信息" key="base">
                  <Row>
                    <Col span="12">
                      <FormItem
                        name="name"
                        label="企业名称"
                        rules={[{ required: true, min: 2, max: 20 }]}
                        initialValue={entInfo.name || ''}
                      >
                        <Input type="text" placeholder="企业名称" />
                      </FormItem>
                    </Col>
                    <Col span="12">
                      <FormItem
                        name="type"
                        label="适用系统"
                        initialValue={entInfo.type || ['DINGDING']}
                      >
                        <CheckboxGroup>
                          <Checkbox value="DINGDING" disabled>
                            钉钉
                          </Checkbox>
                        </CheckboxGroup>
                      </FormItem>
                    </Col>
                  </Row>
                </Panel>
                <Panel header="钉钉参数" key="ddParam">
                  <Row>
                    <Col span="12">
                      <FormItem
                        name="corp_id"
                        label="CorpID"
                        initialValue={entInfo.corp_id || ''}
                        rules={[{ required: true, min: 1, max: 36 }]}
                      >
                        <Input type="text" />
                      </FormItem>
                    </Col>
                    <Col span="12">
                      <FormItem
                        name="agent_id"
                        label="AgentID"
                        rules={[{ required: true, min: 1, max: 10 }]}
                        initialValue={entInfo.agent_id || ''}
                      >
                        <Input type="text" />
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span="12">
                      <FormItem
                        name="app_key"
                        label="AppKey"
                        initialValue={entInfo.app_key || ''}
                        rules={[{ required: true, min: 1, max: 20 }]}
                      >
                        <Input type="text" />
                      </FormItem>
                    </Col>
                    <Col span="12">
                      <FormItem
                        name="app_secret"
                        label="AppSecret"
                        initialValue={entInfo.app_secret || ''}
                        rules={[{ required: true, min: 1, max: 64 }]}
                      >
                        <Input type="text" />
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span="12">
                      <FormItem
                        name="api_base_url"
                        label="服务器地址"
                        initialValue={entInfo.api_base_url || ''}
                        rules={[{ required: true, min: 1, max: 200 }]}
                      >
                        <Input type="text" />
                      </FormItem>
                    </Col>
                  </Row>
                </Panel>
              </Collapse>
              <Row>
                <Col span={24}>
                  <Card>
                    <Button type="primary" style={{ marginLeft: 300 }} onClick={onSubmit}>
                      保存
                    </Button>
                  </Card>
                </Col>
              </Row>
            </Form>
          </div>
        </Spin>
      </PageContainer>
    );
  };
  return render();
};

export default EditEnt;
