import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Input, Space, message } from 'antd';
import { SendOutlined, LoadingOutlined } from '@ant-design/icons';
import { history } from 'umi';
import CSVUploader from '@/components/FileUploader/CSVUploader';
import { getEmailTemplate, sendEmailInvitations } from '@/pages/AppCenter/service';
import type { AppType } from '@/pages/AppCenter/data';

const { TextArea } = Input;
const FormItem = Form.Item;
const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};

export interface emailInvitationsProps {
  appInfo: Partial<AppType>;
}

const SmsInvitations: React.FC<emailInvitationsProps> = (props) => {
  const { appInfo } = props;
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [template, setTemplate] = useState<any>();
  const [targets, setTargets] = useState<string[]>([]);

  const handleGetEmailTemplate = async () => {
    try {
      const emailTemplate = await getEmailTemplate();
      setTemplate(emailTemplate.data);
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    handleGetEmailTemplate();
  }, []);

  // set targets
  const handleSetTargets = async (emailTargets: string[]) => {
    setTargets(emailTargets);
  };

  // send email
  const handleSendEmails = async (fields: any) => {
    const hide = message.info('正在发送邮件');
    setSubmitting(true);
    try {
      const result: any = await sendEmailInvitations(fields);
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
      message.error('邮件接收者至少为一个人');
      return;
    }

    if (targets.length > 2000) {
      message.error('邮件接收者不能超过2000人');
      return;
    }

    handleSendEmails(fields);
  };
  // 设置表单数据
  setTimeout(() => {
    form.setFieldsValue({
      name: appInfo?.name,
      title: template?.title,
      content: template?.content,
      targets: [],
    });
  }, 500);

  return (
    <Card title="邮件邀请">
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
        <FormItem label="邮件标题" name="title" shouldUpdate>
          <Input placeholder="邮件标题" disabled={true} />
        </FormItem>
        <FormItem label="邮件内容" name="content" shouldUpdate>
          <TextArea
            autoSize={{ minRows: 3, maxRows: 6 }}
            placeholder="请输入邮件内容"
            disabled={true}
          />
        </FormItem>
        <FormItem label="接收者" name="targets" required={true} shouldUpdate>
          <CSVUploader
            type={'email'}
            maxCount={2000}
            onChange={(data: string[]) => handleSetTargets(data)}
          />
        </FormItem>
        <FormItem wrapperCol={{ span: 12, offset: 4 }}>
          <Space>
            <Button type="primary" onClick={() => validateForm()} disabled={submitting}>
              {submitting ? <LoadingOutlined /> : <SendOutlined />} 发送邮件
            </Button>
          </Space>
        </FormItem>
      </Form>
    </Card>
  );
};
export default SmsInvitations;
