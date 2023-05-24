import React from 'react';
import { Form, Input, Modal, Radio, Select } from 'antd';
import type { AppVersionType } from '@/pages/AppCenter/data';
import * as configs from '@/utils/configs.utils';
import { useIntl } from 'umi';

const { TextArea } = Input;
const { Option } = Select;
const options = [
  { label: 'iPhone', value: '20' },
  { label: 'iPad', value: '21' },
  { label: 'iPad mini', value: '22' },
  { label: 'iPod Touch', value: '23' },
];
const FormItem = Form.Item;

interface ConfirmUploadProps {
  appVersionInfo: Partial<AppVersionType>;
  platformName: string;
  confirmModalVisible: boolean;
  onSubmit: (fieldsValue: any) => void;
  onCancel: () => void;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const ConfirmUpload: React.FC<ConfirmUploadProps> = (props) => {
  const [form] = Form.useForm();
  const intl = useIntl();
  const sessionStorageLicense = JSON.parse(sessionStorage.getItem('licConfig') || '{}');
  const {
    appVersionInfo,
    platformName,
    confirmModalVisible,
    onSubmit: handleSaveAppVersion,
    onCancel,
  } = props;

  const ossVersions = platformName === 'ANDROID' ? configs.AndroidVersions : configs.IosVersions;

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    const modelType = fieldsValue?.modelTypes?.join(',');
    delete fieldsValue.modelTypes;
    // form.resetFields();
    const values = {
      ...fieldsValue,
      appName: appVersionInfo.appName,
      pkgName: appVersionInfo.pkgName,
      version: appVersionInfo.version,
      modelType,
    };
    handleSaveAppVersion(values);
  };
  return (
    <Modal
      destroyOnClose
      title="应用信息"
      open={confirmModalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
      okText="确认"
      cancelText="取消"
      maskClosable={false}
    >
      <Form form={form} initialValues={appVersionInfo} {...formLayout}>
        <FormItem label="应用名称">{appVersionInfo.appName}</FormItem>
        <FormItem label="应用程序文件">{appVersionInfo.originalFileName}</FormItem>
        <FormItem label="应用版本">{appVersionInfo.version}</FormItem>
        <FormItem label="应用大小">
          {appVersionInfo.size ? `${Math.round(appVersionInfo.size / 1024 / 1024)}MB` : '--'}
        </FormItem>
        <FormItem label="应用程序ID">{appVersionInfo.pkgName}</FormItem>
        {!sessionStorageLicense?.license_config?.adm?.use_platform_distribute ? (
          <FormItem
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'EnterpriseAppDistribution.inputTips.pleaseAddress',
                }),
              },
            ]}
            name="downloadUrl"
            label={intl.formatMessage({
              id: 'EnterpriseAppDistribution.label.downAddress',
            })}
          >
            <Input
              placeholder={intl.formatMessage({
                id: 'EnterpriseAppDistribution.inputTips.pleaseAddress',
              })}
            />
          </FormItem>
        ) : (
          ''
        )}
        {!sessionStorageLicense?.license_config?.adm?.use_platform_distribute &&
        platformName == 'IOS' ? (
          <FormItem
            rules={[
              {
                required: true,
                message: '请选择你的分发模式',
              },
            ]}
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
        <FormItem
          label="系统要求"
          name="osVersion"
          rules={[{ required: true, message: '请选择系统' }]}
        >
          <Select>
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
        {platformName === 'IOS' ? (
          <FormItem
            label="兼容设备"
            name="modelTypes"
            rules={[{ required: true, message: '请选择兼容设备' }]}
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
        ) : null}
        <FormItem label="开发商" name="company">
          <Input placeholder="请输入开发商名称" />
        </FormItem>
        <FormItem label="应用简介" name="comment">
          <TextArea placeholder="编辑应用简介..." autoSize={{ minRows: 2, maxRows: 6 }} />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default ConfirmUpload;
