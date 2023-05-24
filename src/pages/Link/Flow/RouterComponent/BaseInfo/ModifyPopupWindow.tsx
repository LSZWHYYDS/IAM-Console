import { Form, Input, Modal, message } from 'antd';
import { useState, useImperativeHandle, forwardRef } from 'react';
import { saveFlow } from '../../service';
const { TextArea } = Input;
const ModifyPopupWindow = (props: any, ref: any) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const showModal = () => {
    form.resetFields();
    form.setFieldsValue(props.flowData);
    setOpen(true);
  };

  const handleOk = async () => {
    form.validateFields().then(async (rs: any) => {
      const { flowData = {} } = props;
      const bodyParams = {
        ...flowData,
        description: rs?.description,
        name: rs?.name,
        status: '1',
      };
      setConfirmLoading(true);
      await saveFlow(props.id, bodyParams).then((result: any) => {
        if (result?.error_description == 'SUCCESS') {
          message.success('修改成功');
          setOpen(false);
          setConfirmLoading(false);
          props?.reloadTableData();
          // props?.getFlowData();
          location.reload();
        }
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

  return (
    <>
      <Modal
        title={(props.flowData && '编辑连接流') || '添加连接流'}
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="流名称"
            name="name"
            rules={[{ required: true, message: '请输入你的流名称' }]}
          >
            <Input placeholder="请输入你的流名称" />
          </Form.Item>

          <Form.Item
            label="流描述"
            name="description"
            rules={[{ required: true, message: '请输入你的描述信息' }]}
          >
            <TextArea rows={4} placeholder="请输入你的描述" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default forwardRef(ModifyPopupWindow);
