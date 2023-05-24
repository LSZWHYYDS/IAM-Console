import { Col, Form, Input, Radio, Row } from 'antd';
import React, { useImperativeHandle, forwardRef } from 'react';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

const BaseLinker = (props: any, ref) => {
  const [formBasic] = Form.useForm();
  useImperativeHandle(ref, () => ({
    getData: () => {
      return formBasic.validateFields();
    },
    setData: () => {
      return formBasic.setFieldsValue(props.data);
    },
  }));
  const renderBasicForm = () => {
    const { description, type, name } = props.data || {};
    return (
      <Form form={formBasic}>
        <Row>
          <Col span="17">
            <Row>
              <Col span="24">
                <FormItem
                  name="name"
                  label="连接器名称"
                  initialValue={name}
                  rules={[{ required: true, message: '请输入' }]}
                  {...formItemLayout}
                >
                  <Input type="text" />
                </FormItem>
              </Col>
              <Col span="24">
                <FormItem
                  name="type"
                  label="类型"
                  initialValue={type || 'HTTP'}
                  rules={[{ required: true, message: '请输入' }]}
                  {...formItemLayout}
                >
                  <Radio.Group disabled={!!props.data?.id}>
                    <Radio value="HTTP">HTTP</Radio>
                    <Radio value="DATABASE">Database</Radio>
                  </Radio.Group>
                </FormItem>
              </Col>
              <Col span="24">
                <FormItem
                  name="description"
                  label="连接器描述"
                  initialValue={description}
                  {...formItemLayout}
                >
                  <Input.TextArea />
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    );
  };
  const render = () => {
    return renderBasicForm();
  };
  return render();
};

export default forwardRef(BaseLinker);
