import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, message, Switch, Radio, Tooltip } from 'antd';
import { InfoCircleOutlined, LoadingOutlined, SendOutlined } from '@ant-design/icons';
import { getGatewayConfigs, updateGatewayConfigs } from '../service';
import type { GatewayConfigsType } from '../data';
import { PageLoading } from '@ant-design/pro-layout';

const FormItem = Form.Item;
const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};

interface EditDetailsProps {
  id: string;
}

const EditAppGateways: React.FC<EditDetailsProps> = (props) => {
  const { id } = props;
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gatewayConfigs, setGatewayConfigs] = useState<GatewayConfigsType>();

  const handleGetGatewayConfigs = async () => {
    await getGatewayConfigs({ client_id: id })
      .then(async (res) => {
        if (res.error === '0') {
          setGatewayConfigs(res.data);
        } else {
          message.error('获取网关设置失败，请重试');
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleGetGatewayConfigs();
  }, [id]);

  const handleNext = async () => {
    const fieldsValue: GatewayConfigsType = await form.validateFields();
    const { status } = fieldsValue;
    setSubmitting(true);
    await updateGatewayConfigs({ ...fieldsValue, client_id: id, status: status ? 1 : 0 })
      .then(async (res) => {
        if (res.error === '0') {
          message.success('更新成功');
        } else {
          message.error('更新失败，请重试');
        }
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <>
      {!loading ? (
        <Card title="基本信息" style={{ marginBottom: '24px' }}>
          <Form
            form={form}
            initialValues={{
              ...gatewayConfigs,
              predicate_type: gatewayConfigs?.predicate_type || 2,
            }}
            {...formLayout}
          >
            <FormItem label="安全网关" name="status" shouldUpdate valuePropName="checked">
              <Switch />
            </FormItem>

            <FormItem noStyle shouldUpdate>
              {({ getFieldValue }) => {
                if (getFieldValue('status')) {
                  return (
                    <>
                      <FormItem label="识别类型" name="predicate_type" shouldUpdate>
                        <Radio.Group optionType="button" buttonStyle="solid">
                          <Radio.Button value={1}>应用标识</Radio.Button>
                          <Radio.Button value={2}>
                            访问域名
                            <Tooltip placement="right" title={'当前仅支持一个应用对应一个域名情况'}>
                              <InfoCircleOutlined style={{ marginLeft: '4px' }} />
                            </Tooltip>
                          </Radio.Button>
                        </Radio.Group>
                      </FormItem>
                      <FormItem
                        label="服务器路由地址及端口"
                        name="route_url"
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: '请输入服务器路由地址及端口',
                          },
                        ]}
                        shouldUpdate
                      >
                        <Input placeholder="https://127.0.0.1:8008" />
                      </FormItem>

                      <FormItem noStyle shouldUpdate>
                        {() => {
                          if (getFieldValue('predicate_type') === 1) {
                            return (
                              <>
                                <FormItem
                                  label="应用标识"
                                  name="access_prefix"
                                  rules={[
                                    {
                                      required: true,
                                      whitespace: true,
                                      message: '请输入应用标识',
                                    },
                                  ]}
                                  shouldUpdate
                                >
                                  <Input placeholder="/oa" />
                                </FormItem>
                                <FormItem label="服务访问时" name="path_strip_prefix" shouldUpdate>
                                  <Radio.Group optionType="button" buttonStyle="solid">
                                    <Radio.Button value={0}>携带标识</Radio.Button>
                                    <Radio.Button value={1}>隐藏标识</Radio.Button>
                                  </Radio.Group>
                                </FormItem>
                              </>
                            );
                          }
                          return (
                            <FormItem label="访问域名" name="host_addr" shouldUpdate>
                              <Input placeholder="请输入域名" />
                            </FormItem>
                          );
                        }}
                      </FormItem>
                    </>
                  );
                }
                return null;
              }}
            </FormItem>

            <FormItem wrapperCol={{ offset: 4 }}>
              <Button
                type="primary"
                onClick={() => handleNext()}
                icon={submitting ? <LoadingOutlined /> : <SendOutlined />}
                disabled={submitting}
              >
                保存
              </Button>
            </FormItem>
          </Form>
        </Card>
      ) : (
        <PageLoading />
      )}
    </>
  );
};
export default EditAppGateways;
