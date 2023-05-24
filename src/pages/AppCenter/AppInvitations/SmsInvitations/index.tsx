import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Input, Space, message } from 'antd';
import { SendOutlined, LoadingOutlined } from '@ant-design/icons';
import CSVUploader from '@/components/FileUploader/CSVUploader';
import { getSmsTemplate, sendSmsInvitations } from '@/pages/AppCenter/service';
import type { AppType } from '@/pages/AppCenter/data';
import { history } from 'umi';

const { TextArea } = Input;
const FormItem = Form.Item;
const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};

export interface smsInvitationsProps {
  appInfo: Partial<AppType>;
}

const SmsInvitations: React.FC<smsInvitationsProps> = (props) => {
  const { appInfo } = props;
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [template, setTemplate] = useState<any>();
  const [targets, setTargets] = useState<string[]>([]);

  const handleGetSmsTemplate = async () => {
    try {
      const smsTemplate = await getSmsTemplate();
      setTemplate(smsTemplate.data);
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    handleGetSmsTemplate();
  }, []);

  // set targets
  const handleSetTargets = async (smsTargets: string[]) => {
    setTargets(smsTargets);
  };

  // send sms
  const handleSendSMS = async (fields: any) => {
    const hide = message.info('正在发送短信');
    setSubmitting(true);
    try {
      const result: any = await sendSmsInvitations(fields);
      if (result.code === '0') {
        hide();
        message.success('发送成功');
        setSubmitting(false);
      } else {
        hide();
        message.error(result.message);
        setSubmitting(false);
      }
    } catch (error) {
      message.error('服务器错误，请重试！');
    }
  };

  // Validate form
  const validateForm = async () => {
    const fieldsValue = await form.validateFields();
    const fields = { ...fieldsValue, targets };

    if (targets.length === 0) {
      message.error('短信接收者至少为一个人');
      return;
    }

    if (targets.length > 2000) {
      message.error('短信接收者不能超过2000人');
      return;
    }

    handleSendSMS(fields);
  };
  // 设置表单数据
  setTimeout(() => {
    form.setFieldsValue({
      name: appInfo?.name,
      content: template?.content,
      targets: [],
    });
  }, 500);

  return (
    <Card title="短信邀请">
      <Form form={form} {...formLayout}>
        <FormItem
          label="分发应用名称"
          name="name"
          extra={
            <>
              如需更改分发应用，请在
              <a onClick={() => history.push('/distribution/abmapps')}>ABM 应用分发</a>
              中切换选中应用
            </>
          }
          shouldUpdate
        >
          <Input placeholder="应用名称" disabled={true} />
        </FormItem>
        <FormItem label="短信内容" name="content" shouldUpdate>
          <TextArea
            autoSize={{ minRows: 3, maxRows: 6 }}
            placeholder="请输入短信内容"
            disabled={true}
          />
        </FormItem>
        <FormItem label="接收者" name="targets" required={true} shouldUpdate>
          <CSVUploader
            type={'phone'}
            maxCount={2000}
            onChange={(data: string[]) => {
              handleSetTargets(data);
            }}
          />
        </FormItem>
        <FormItem wrapperCol={{ span: 12, offset: 4 }}>
          <Space>
            <Button type="primary" onClick={() => validateForm()} disabled={submitting}>
              {submitting ? <LoadingOutlined /> : <SendOutlined />} 发送短信
            </Button>
          </Space>
        </FormItem>
      </Form>
    </Card>
  );
};
export default SmsInvitations;
