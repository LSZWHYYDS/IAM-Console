import { UserOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import { forwardRef } from 'react';
import ListPopupCom from '@/pages/AppCenter/Classification/components/ListComponent';
import { Controls } from './controls';

const ListPopupComLS: React.FC<any> = forwardRef((props, ref: any) => {
  return <ListPopupCom ref={ref} {...props} />;
});
const editClassModel = (props, ref) => {
  const {
    state,
    clearInput,
    createClassIfication,
    handleChangeEvent,
    handleCancel,
    handleOk,
    PopupComRef,
    requestClassApplication,
  } = Controls(ref, props.againRequestClass);

  const { visible, confirmLoading, inputValue } = state;
  return (
    <>
      <Modal
        title="编辑分类"
        open={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width="750px"
        style={{ marginTop: '100px' }}
        okText="确定"
      >
        <Form
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            label="应用分组"
            name={'usename'}
            colon={false}
            rules={[{ required: true, message: 'Please input your username!' }]}
          ></Form.Item>
        </Form>
        <Row>
          <Col span={19}>
            <Input
              size="middle"
              placeholder="请填写分组名称"
              prefix={<UserOutlined />}
              value={inputValue}
              onChange={handleChangeEvent}
            />
          </Col>
          <Col span={1}></Col>
          <Col span={4}>
            <Button type="primary" onClick={createClassIfication}>
              创建分组
            </Button>
          </Col>
        </Row>
        <ListPopupComLS
          ref={PopupComRef}
          clearHandle={clearInput}
          againRequestClassList={requestClassApplication}
        />
      </Modal>
    </>
  );
};
export default forwardRef(editClassModel);
