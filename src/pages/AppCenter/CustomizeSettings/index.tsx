import ColorPicker from '@/components/ColorPicker';
import ImageUploader from '@/components/ImageUploader';
import conf from '@/utils/conf';
import { CopyOutlined } from '@ant-design/icons';
import { PageContainer, PageLoading } from '@ant-design/pro-layout';
import { Button, Card, Col, Divider, Form, Input, message, Radio, Row } from 'antd';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import type { configKeyType, configKeyValueType, extractConfType } from '../data';
import { getByConfigKey, saveConfigKey } from '../service';
import Preview from './PhonePreview';

const FormItem = Form.Item;
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};
const { TextArea } = Input;
const options = [
  { label: '不验证', value: 'NONE' },
  { label: '提取码', value: 'EXTRACTED_CODE' },
  { label: '阿里云iDaas', value: 'IDAAS' },
  { label: '短信验证', value: 'SMS' },
];

const CustomizeSettings: FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewConfig, setPreviewConfig] = useState<extractConfType>({});

  // 获取配置并拆分数据
  const handleGetByConfigKey = async () => {
    setLoading(true);
    await getByConfigKey({ on: 'persona', configKey: 'appDownloadConfig' })
      .then(async (res) => {
        if (res.code === '0') {
          if (res.data && res.data.configValue) {
            // setConfigKey(res.data);
            const configValues: configKeyValueType = JSON.parse(res.data.configValue);
            const formFields: extractConfType = {
              logoUrl: configValues.verifyConf?.extractConf?.logoUrl,
              bgUrl: configValues.verifyConf?.extractConf?.bgUrl,
              curColor: configValues.verifyConf?.extractConf?.curColor,
              title: `${configValues.verifyConf?.extractConf?.title}${
                configValues.verifyConf?.extractConf?.title_en
                  ? `|${configValues.verifyConf?.extractConf?.title_en}`
                  : ''
              }`,
              validationTip: `${configValues.verifyConf?.extractConf?.validationTip}${
                configValues.verifyConf?.extractConf?.validationTip_en
                  ? `|${configValues.verifyConf?.extractConf?.validationTip_en}`
                  : ''
              }`,
              tip: `${configValues.verifyConf?.extractConf?.tip}${
                configValues.verifyConf?.extractConf?.tip_en
                  ? `|${configValues.verifyConf?.extractConf?.tip_en}`
                  : ''
              }`,
              code: configValues.verifyConf?.extractConf?.code,
              type: configValues?.verifyConf?.type || 'NONE',
            };
            setLoading(false);
            setPreviewConfig(formFields);
            form.setFieldsValue(formFields);
          } else {
            form.setFieldsValue({
              type: 'NONE',
            });
          }
        } else {
          message.error('未能获取服务器配置表，请刷新页面重试');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 提交数据
  const handleUpdateConfigKey = async (fields: configKeyType) => {
    const hide = message.info('正在保存设置');
    setSubmitting(true);
    await saveConfigKey(fields).then(async (res) => {
      if (res.code === '0') {
        hide();
        message.success('设置保存成功');
        setSubmitting(false);
      } else {
        hide();
        message.error('设置保存失败，请重试');
        setSubmitting(false);
      }
    });
  };

  // Logo 发生改变
  const handleChangeLogo = async (image: string) => {
    const fields = { ...previewConfig, logoUrl: image };
    form.setFieldsValue(fields);
  };

  // 背景图发生改变
  const handleChangeBgImage = async (image: string) => {
    const fields = { ...previewConfig, bgUrl: image };
    form.setFieldsValue(fields);
  };

  // 字段值发生改变
  const handleFieldsChange = async (fields: any) => {
    setPreviewConfig(fields);
  };

  // 根据中竖线拆分字符串
  const splitLang = (str: string, lang: string) => {
    const strNew = str.replace('｜', '|');
    return lang === 'cn' ? strNew.split('|')[0] : strNew.split('|')[1];
  };

  // 点击提交按钮，重新组合数据
  const handleEditConfigs = async () => {
    const fieldsValue: extractConfType = await form.validateFields();
    const configValue = {
      verifyConf: {
        type: fieldsValue.type,
        extractConf: {
          logoUrl: fieldsValue.logoUrl,
          bgUrl: fieldsValue.bgUrl,
          curColor: fieldsValue.curColor,
          title: splitLang(fieldsValue.title || '', 'cn'),
          title_en: splitLang(fieldsValue.title || '', 'en'),
          validationTip: splitLang(fieldsValue.validationTip || '', 'cn'),
          validationTip_en: splitLang(fieldsValue.validationTip || '', 'en'),
          tip: splitLang(fieldsValue.tip || '', 'cn'),
          tip_en: splitLang(fieldsValue.tip || '', 'en'),
          code: fieldsValue.code || '',
        },
      },
    };

    const fields = { configKey: 'appDownloadConfig', configValue: JSON.stringify(configValue) };
    handleUpdateConfigKey(fields);
  };

  // 按钮背景色发生改变
  const handleChangeBtnColor = async (color: string) => {
    const fields = { ...previewConfig, curColor: color };
    setPreviewConfig(fields);
    // form.setFieldsValue(fields);
  };

  useEffect(() => {
    handleGetByConfigKey();
  }, []);

  // useEffect(() => {
  //   form.setFieldsValue(previewConfig);
  // }, [previewConfig]);
  const downloadUrl = () => {
    const index = conf.getBackendUrl().lastIndexOf('/');
    const url =
      conf.getBackendUrl().slice(0, index) +
      '/adm/download/?tenantId=' +
      sessionStorage.getItem('tcode');
    return url;
  };
  const showCopyMsg = () => {
    message.info('复制成功，请在需要的位置粘贴。');
  };
  const renderDownload = () => {
    const vppcode = downloadUrl() + '&channel=VPP_CODE';
    const managedID = downloadUrl() + '&channel=MANAGEID';
    return (
      <>
        <FormItem label="下载地址(VPP Code)" name="vppcode">
          {vppcode}
          <CopyToClipboard text={vppcode}>
            <a title="复制下载地址" onClick={() => showCopyMsg()}>
              <CopyOutlined style={{ fontSize: '24' }} />
            </a>
          </CopyToClipboard>
        </FormItem>
        <FormItem
          label="下载地址(Managed ID)"
          extra="用以 Managed Apple ID 下载的链接"
          name="ManagedID"
        >
          {managedID}
          <CopyToClipboard text={managedID}>
            <a title="复制下载地址" onClick={() => showCopyMsg()}>
              <CopyOutlined style={{ fontSize: '24' }} />
            </a>
          </CopyToClipboard>
        </FormItem>
      </>
    );
  };
  return (
    <>
      {!loading && previewConfig ? (
        <PageContainer title={false}>
          <Card title="应用分发页面定制">
            <Row>
              <Col span={12}>
                <Form
                  form={form}
                  onValuesChange={(_, allFields) => {
                    handleFieldsChange(allFields);
                  }}
                  {...formLayout}
                >
                  <FormItem label="页面 Logo" name="logoUrl" shouldUpdate>
                    <ImageUploader maxSize={500} onChange={handleChangeLogo} />
                  </FormItem>
                  <FormItem label="页面背景图" name="bgUrl" shouldUpdate>
                    <ImageUploader maxSize={500} onChange={handleChangeBgImage} />
                  </FormItem>
                  <FormItem label="按钮颜色" name="curColor" shouldUpdate>
                    <ColorPicker
                      initValue={'#1890ff'}
                      onClose={(color) => {
                        handleChangeBtnColor(color);
                      }}
                    />
                  </FormItem>
                  <FormItem
                    label="标题文案"
                    name="title"
                    rules={[{ required: true, message: '请输入标题文案' }]}
                    extra="如需支持中英文，请用半角“|”隔开中文和英文，如“欢迎|Welcome”"
                    shouldUpdate
                  >
                    <Input placeholder="请输入标题文案" />
                  </FormItem>
                  <FormItem
                    label="验证引导文案"
                    name="validationTip"
                    extra="如需支持中英文，请用半角“|”隔开中文和英文，如“欢迎|Welcome”"
                    shouldUpdate
                  >
                    <Input placeholder="请输入验证引导文案" />
                  </FormItem>
                  <FormItem
                    label="底部提示文案"
                    name="tip"
                    extra="如需支持中英文，请用半角“|”隔开中文和英文，如“欢迎|Welcome”"
                    shouldUpdate
                  >
                    <TextArea placeholder="请输入底部提示文案" />
                  </FormItem>
                  <FormItem label="验证方式" name="type">
                    <Radio.Group options={options} optionType="button" buttonStyle="solid" />
                  </FormItem>
                  <FormItem shouldUpdate noStyle>
                    {({ getFieldValue }) => (
                      <>
                        {getFieldValue('type') === 'EXTRACTED_CODE' ? (
                          <FormItem
                            label="验证码"
                            name="code"
                            rules={[{ required: true, message: '请输入验证码' }]}
                            shouldUpdate
                          >
                            <Input placeholder="请输入验证码" />
                          </FormItem>
                        ) : null}
                      </>
                    )}
                  </FormItem>
                  {renderDownload()}
                  <FormItem wrapperCol={{ span: 8, offset: 7 }}>
                    <Button
                      type="primary"
                      onClick={() => {
                        handleEditConfigs();
                      }}
                      disabled={submitting}
                    >
                      保存
                    </Button>
                  </FormItem>
                </Form>
              </Col>
              <Col span={10} offset={2}>
                <Preview previewConfigs={previewConfig} />
              </Col>
            </Row>
            <Divider />
          </Card>
        </PageContainer>
      ) : (
        <PageLoading />
      )}
    </>
  );
};

export default CustomizeSettings;
