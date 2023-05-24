import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Form,
  Button,
  Input,
  Select,
  Space,
  Card,
  Avatar,
  Descriptions,
  Typography,
  Radio,
} from 'antd';
import { getAppVersionInfoById } from '../../service';
import type { AppVersionType } from '@/pages/AppCenter/data';
import * as configs from '@/utils/configs.utils';
import styles from '../style.less';
// import Paragraph from 'antd/lib/skeleton/Paragraph';
import { useIntl } from 'umi';

const { TextArea } = Input;
const { Option } = Select;
const { Paragraph } = Typography;
const options = [
  { label: 'iPhone', value: '20' },
  { label: 'iPad', value: '21' },
  { label: 'iPad mini', value: '22' },
  { label: 'iPod Touch', value: '23' },
];

export interface EditAppVersionProps {
  onSubmit: (values: Partial<AppVersionType>) => void;
  onClose: (flag?: boolean) => void;
  currentAppVersion: Partial<AppVersionType>;
  platformName: string;
  showEditDrawer: boolean;
}

const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const FormItem = Form.Item;

const EditAppVersion: React.FC<EditAppVersionProps> = (props) => {
  const [form] = Form.useForm();
  const intl = useIntl();
  const sessionStorageLicense = JSON.parse(sessionStorage.getItem('licConfig') || '{}');
  const {
    onSubmit: handleUpdate,
    currentAppVersion,
    platformName,
    onClose: setShowDetail,
    showEditDrawer,
  } = props;
  const [currentVersion, setCurrentVersion] = useState<AppVersionType>({});

  let ossVersions = platformName === 'ANDROID' ? configs.AndroidVersions : configs.IosVersions;
  if (platformName === 'ANDROID') {
    ossVersions = configs.AndroidVersions;
  } else if (platformName === 'IOS') {
    ossVersions = configs.IosVersions;
  } else if (platformName === 'WINDOWS') {
    ossVersions = configs.WINDOWSVersions;
  } else {
    ossVersions = configs.macVersions;
  }
  const handleGetAppVersion = async () => {
    const { id } = currentAppVersion;
    await getAppVersionInfoById({ id }).then((res) => {
      if (res.code === '0') {
        let fields: Partial<AppVersionType> = res.data;
        const modelTypes = fields.modelType?.split(',');
        delete fields.modelType;
        fields = { ...fields, modelTypes };
        form.setFieldsValue(fields);
        setCurrentVersion(res.data);
      }
    });
  };

  useEffect(() => {
    handleGetAppVersion();
  }, [currentAppVersion]);

  const handleNext = async () => {
    const fieldsValue: Partial<AppVersionType> = await form.validateFields();
    const modelType = fieldsValue?.modelTypes?.join(',');
    delete fieldsValue.modelTypes;
    const fields = {
      ...fieldsValue,
      id: currentVersion?.id,
      appName: currentVersion?.appName,
      platform: platformName,
      version: currentVersion?.version,
      pkgName: currentVersion?.pkgName,
      modelType,
    };
    handleUpdate(fields);
  };

  const RenderCardTopTitle = () => {
    return (
      <Space align="center" size={[0, 16]}>
        <Avatar size={34} shape="square" src={currentVersion?.icon} />
        <Paragraph style={{ margin: 0, fontWeight: 500, marginLeft: '10px' }}>
          {currentVersion?.appName || '未设置应用名称'}
        </Paragraph>
      </Space>
    );
  };

  return (
    <Drawer
      title={'编辑应用信息'}
      closable={true}
      maskClosable={true}
      width={'50%'}
      open={showEditDrawer}
      onClose={() => {
        setShowDetail(false);
      }}
      bodyStyle={{ background: '#f1f2f6' }}
      footer={
        <Space>
          <Button onClick={() => setShowDetail(false)}>取消</Button>
          <Button type="primary" onClick={() => handleNext()}>
            保存
          </Button>
        </Space>
      }
      footerStyle={{ display: 'flex', justifyContent: 'flex-end' }}
    >
      <Form form={form} {...formLayout} labelWrap={true}>
        <Card bordered={false} style={{ marginBottom: '24px' }} title={<RenderCardTopTitle />}>
          <FormItem label="开发商" name="company" labelCol={{ span: 3 }}>
            <Input placeholder="请输入开发商名称" />
          </FormItem>
          <FormItem label="应用简介" name="comment" labelCol={{ span: 3 }}>
            <TextArea placeholder="编辑应用简介..." autoSize={{ minRows: 2, maxRows: 6 }} />
          </FormItem>
          {['WINDOWS', 'MACOS'].includes(platformName) ? (
            <>
              <FormItem
                rules={[{ required: true }]}
                label={intl.formatMessage({
                  id: 'EnterpriseAppDistribution.label.downAddress',
                })}
                name="downloadUrl"
                labelCol={{ span: 3 }}
              >
                <Input
                  placeholder={intl.formatMessage({
                    id: 'EnterpriseAppDistribution.inputTips.pleaseAddress',
                  })}
                />
              </FormItem>
            </>
          ) : !sessionStorageLicense?.license_config?.adm?.use_platform_distribute ? (
            <>
              <FormItem
                rules={[{ required: true }]}
                label={intl.formatMessage({
                  id:
                    platformName == 'IOS'
                      ? 'EnterpriseAppDistribution.label.installAddress'
                      : '下载地址',
                })}
                name="downloadUrl"
                labelCol={{ span: 3 }}
              >
                <Input
                  placeholder={intl.formatMessage({
                    id: 'EnterpriseAppDistribution.inputTips.pleaseAddress',
                  })}
                />
              </FormItem>
              {platformName == 'IOS' ? (
                <FormItem
                  rules={[
                    {
                      required: true,
                      message: '请选择你的分发模式',
                    },
                  ]}
                  labelCol={{ span: 3 }}
                  name="distProtocol"
                  label={'分发模式'}
                >
                  <Radio.Group defaultValue={'INHOUSE'}>
                    <Radio value={'INHOUSE'}>in-house</Radio>
                    <Radio value={'UNLISTED'}>unlisted</Radio>
                  </Radio.Group>
                </FormItem>
              ) : (
                ''
              )}
            </>
          ) : (
            ''
          )}
        </Card>

        {['WINDOWS', 'MACOS'].includes(platformName) ? (
          <Card
            title="详细信息"
            bordered={false}
            className={styles.appInfoCard}
            style={{ marginBottom: '24px' }}
          >
            <Descriptions column={24}>
              <Descriptions.Item span={12}>
                <Form.Item
                  label="当前版本"
                  labelCol={{ span: 5 }}
                  style={{ display: 'flex', width: '100%' }}
                >
                  {currentVersion?.version}
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item span={12}>
                <FormItem
                  label="系统要求"
                  name="osVersion"
                  rules={[{ required: true, message: '请选择系统' }]}
                  style={{ display: 'flex', width: '100%' }}
                >
                  <Select style={{ width: '100%' }}>
                    {ossVersions && ossVersions.length > 0
                      ? ossVersions.map((version: string) => {
                          return (
                            <Option value={version} label={version} key={version}>
                              <div className="demo-option-label-item">{version}</div>
                            </Option>
                          );
                        })
                      : null}
                  </Select>
                </FormItem>
              </Descriptions.Item>
              {platformName === 'IOS' ? (
                <Descriptions.Item label="系统要求">
                  <FormItem
                    label="兼容设备"
                    name="modelTypes"
                    rules={[{ required: true, message: '请选择兼容设备' }]}
                    noStyle
                  >
                    <Select mode="multiple" style={{ width: '100%' }}>
                      {options && options.length > 0
                        ? options.map((option: any) => {
                            return (
                              <Option value={option.value} label={option.label} key={option.value}>
                                <div className="demo-option-label-item">{option.label}</div>
                              </Option>
                            );
                          })
                        : null}
                    </Select>
                  </FormItem>
                </Descriptions.Item>
              ) : null}
            </Descriptions>
          </Card>
        ) : (
          <Card
            title="详细信息"
            bordered={false}
            className={styles.appInfoCard}
            style={{ marginBottom: '24px' }}
          >
            <Descriptions column={2}>
              <Descriptions.Item label="应用程序文件">
                {currentVersion?.originalFileName}
              </Descriptions.Item>
              <Descriptions.Item label="大小">
                {currentVersion?.size ? `${Math.round(currentVersion.size / 1024 / 1024)}MB` : '--'}
              </Descriptions.Item>
              <Descriptions.Item label="当前版本">{currentVersion?.version}</Descriptions.Item>
              <Descriptions.Item label="应用程序ID">{currentVersion?.pkgName}</Descriptions.Item>
              <Descriptions.Item label="系统要求">
                <FormItem
                  label="系统要求"
                  name="osVersion"
                  rules={[{ required: true, message: '请选择系统' }]}
                  noStyle
                >
                  <Select style={{ width: platformName === 'ANDROID' ? '40%' : '90%' }}>
                    {ossVersions && ossVersions.length > 0
                      ? ossVersions.map((version: string) => {
                          return (
                            <Option value={version} label={version} key={version}>
                              <div className="demo-option-label-item">{version}</div>
                            </Option>
                          );
                        })
                      : null}
                  </Select>
                </FormItem>
              </Descriptions.Item>
              {platformName === 'IOS' ? (
                <Descriptions.Item label="系统要求">
                  <FormItem
                    label="兼容设备"
                    name="modelTypes"
                    rules={[{ required: true, message: '请选择兼容设备' }]}
                    noStyle
                  >
                    <Select mode="multiple" style={{ width: '100%' }}>
                      {options && options.length > 0
                        ? options.map((option: any) => {
                            return (
                              <Option value={option.value} label={option.label} key={option.value}>
                                <div className="demo-option-label-item">{option.label}</div>
                              </Option>
                            );
                          })
                        : null}
                    </Select>
                  </FormItem>
                </Descriptions.Item>
              ) : null}
            </Descriptions>
          </Card>
        )}

        {['WINDOWS', 'MACOS'].includes(platformName) ? (
          ''
        ) : (
          <Card title="其它信息" bordered={false} className={styles.appInfoCard}>
            <Descriptions column={2}>
              <Descriptions.Item label="下载次数">
                {currentVersion?.totalDownload}
              </Descriptions.Item>
              <Descriptions.Item label="上传时间">{currentVersion?.uploadTime}</Descriptions.Item>
            </Descriptions>
          </Card>
        )}
      </Form>
    </Drawer>
  );
};

export default EditAppVersion;
