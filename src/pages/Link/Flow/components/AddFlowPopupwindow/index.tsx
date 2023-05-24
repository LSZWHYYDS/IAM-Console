import { QuestionCircleOutlined } from '@ant-design/icons';
import { Form, Input, Modal, Radio, Tooltip } from 'antd';
import { useState, useImperativeHandle, forwardRef } from 'react';
import { createFlow } from '../../service';
// setConfirmLoading
const App = (props: any, ref: any) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [radio, setRadio] = useState<any>('TRIGGER');
  const [form] = Form.useForm();
  const showModal = () => {
    form.resetFields();
    setOpen(true);
  };

  const handleOk = async () => {
    form.validateFields().then(async (rs: any) => {
      const bodyParams = {
        description: rs?.descript,
        flow_type: rs?.flow_type,
        name: rs?.username,
        status: '1',
      };
      setConfirmLoading(true);
      await createFlow(bodyParams).then(() => {
        setOpen(false);
        setConfirmLoading(false);
        props?.reloadTableData();
      });
    });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useImperativeHandle(ref, () => ({
    showModal,
  }));

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onChange = (e: any) => {
    setRadio(e.target.value);
  };

  return (
    <>
      <Modal
        title="添加连接流"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ flow_type: radio }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="名称"
            name="username"
            rules={[{ required: true, message: '请输入你的流名称' }]}
          >
            <Input placeholder="请输入你的流名称" />
          </Form.Item>

          <Form.Item
            label="描述"
            name="descript"
            rules={[{ required: true, message: '请输入你的描述问题' }]}
          >
            <Input.TextArea placeholder="请输入你的描述" />
          </Form.Item>

          <Form.Item label="流类型" name="flow_type" rules={[{ required: true }]}>
            <Radio.Group onChange={onChange}>
              <Radio value={'TRIGGER'}>
                业务流
                <Tooltip title="监听触发事件流">
                  <QuestionCircleOutlined style={{ marginLeft: '10px' }} />
                </Tooltip>
              </Radio>
              <Radio value={'SCHEDULE'}>
                定时流
                <Tooltip title="定时触发流">
                  <QuestionCircleOutlined style={{ marginLeft: '10px' }} />
                </Tooltip>
              </Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default forwardRef(App);
