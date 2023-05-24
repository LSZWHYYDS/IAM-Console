import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Upload, Form, Input, Radio, Row, Checkbox, message } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';
import { history } from 'umi';
import { CopyOutlined } from '@ant-design/icons';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const CreateOrEditSyncGene: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState({});
  const [formRef] = Form.useForm();

  const loadData = async () => {};
  useEffect(() => {
    loadData();
  }, []);
  const onCancel = () => {
    history.goBack();
  };
  const showCopyMsg = () => {
    message.info('复制成功，请在需要的位置粘贴。');
  };
  const render = () => {
    const { profile_name, config_id } = data || {};

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 13 },
    };
    const formItemLayout1 = {
      labelCol: { span: 3 },
      wrapperCol: { span: 18 },
    };
    return (
      <div id="content" className="content">
        <Form form={formRef} className="formPadding" layout="horizontal" autoComplete="off">
          <Card key="base">
            <Row>
              <Col span="12">
                <FormItem
                  label={<span title="唯一标识">唯一标识</span>}
                  {...formItemLayout}
                  name="唯一标识"
                  initialValue={profile_name || ''}
                  rules={[{ required: true, message: '请输入唯一标识' }]}
                >
                  <Input type="text" />
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem
                  name="显示名称"
                  label={<span title="显示名称">显示名称</span>}
                  {...formItemLayout}
                  initialValue={config_id || 'SAML'}
                  rules={[{ required: true, message: '请输入显示名称' }]}
                >
                  <Input type="text" />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <FormItem
                  name="config_id"
                  label={<span title="应用 Logo">应用 Logo</span>}
                  {...formItemLayout}
                >
                  <Upload />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="24">
                <FormItem
                  label={<span title="验签证书">验签证书</span>}
                  {...formItemLayout1}
                  name="验签证书"
                  initialValue={''}
                  rules={[{ required: true, message: '请输入验签证书' }]}
                >
                  <Input.TextArea />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <FormItem
                  label={<span title="登录 URL">登录 URL</span>}
                  {...formItemLayout}
                  name="URL"
                  initialValue={profile_name || ''}
                  rules={[{ required: true, message: '请输入外部 SAML 提供商的发起认证端点' }]}
                >
                  <Input type="text" />
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem
                  name="SAML请求签名"
                  label={<span title="SAML请求签名">SAML请求签名</span>}
                  {...formItemLayout}
                  initialValue={config_id || '2'}
                >
                  <Radio.Group>
                    <Radio value={1}>是</Radio>
                    <Radio value={2}>否</Radio>
                  </Radio.Group>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <FormItem
                  label={<span title="SAML 请求签名算法">SAML请求签名算法</span>}
                  {...formItemLayout}
                  name="SAML请求签名算法"
                  initialValue={profile_name || ''}
                  rules={[{ required: true }]}
                >
                  <RadioGroup>
                    <Radio value={1}>RSA-SHA256</Radio>
                    <Radio value={2}>RSA-SHA1</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem
                  label={<span title="SAML 请求摘要算法">SAML请求摘要算法</span>}
                  {...formItemLayout}
                  name="SAML请求摘要算法"
                  initialValue={profile_name || ''}
                  rules={[{ required: true }]}
                >
                  <RadioGroup>
                    <Radio value={1}>SHA256</Radio>
                    <Radio value={2}>SHA1</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <FormItem
                  label={<span title="SAML 请求协议绑定">SAML 请求协议绑定</span>}
                  {...formItemLayout}
                  name="请求协议绑定"
                  initialValue={profile_name || ''}
                  rules={[{ required: true }]}
                >
                  <RadioGroup>
                    <Radio value={1}>HTTP-Redirect</Radio>
                    <Radio value={2}>HTTP-POST</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <FormItem
                  label={<span title="单点登出">单点登出</span>}
                  {...formItemLayout}
                  name="单点登出"
                  initialValue={profile_name || ''}
                  rules={[{ required: true }]}
                >
                  <Checkbox />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="24">
                <FormItem
                  label={<span title="ACS URL">ACS URL</span>}
                  {...formItemLayout1}
                  name="ACSURL"
                  initialValue={profile_name || ''}
                  rules={[{ required: true }]}
                >
                  <CopyToClipboard text="https://core.authing.cn/api/v2/connection/saml/{连接 ID}/acs">
                    <a title="复制下载地址" onClick={() => showCopyMsg()}>
                      {'https://core.authing.cn/api/v2/connection/saml/{连接 ID}/acs'}
                      <CopyOutlined style={{ fontSize: '24' }} />
                    </a>
                  </CopyToClipboard>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="24">
                <FormItem
                  label={<span title="元数据 XML 文件">元数据 XML 文件</span>}
                  {...formItemLayout1}
                  name="XML"
                  initialValue={profile_name || ''}
                  rules={[{ required: true }]}
                >
                  <CopyToClipboard text="https://core.authing.cn/api/v2/connection/saml/{连接 ID}/metadata">
                    <a title="复制下载地址" onClick={() => showCopyMsg()}>
                      {'https://core.authing.cn/api/v2/connection/saml/{连接 ID}/metadata'}
                      <CopyOutlined style={{ fontSize: '24' }} />
                    </a>
                  </CopyToClipboard>
                </FormItem>
              </Col>
            </Row>
          </Card>
        </Form>
        <div className="footerContainer" style={{ margin: '0 20px' }}>
          <Button type="primary" className="ml-10">
            保存
          </Button>
          <Button type="ghost" className="ml-10" onClick={onCancel}>
            取消
          </Button>
        </div>
      </div>
    );
  };
  return (
    <PageContainer title={false}>
      <Card title="链接器配置">{render()}</Card>
    </PageContainer>
  );
};
export default CreateOrEditSyncGene;
