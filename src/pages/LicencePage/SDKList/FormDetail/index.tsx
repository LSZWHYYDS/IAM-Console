import { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Row, message } from 'antd';
import { clientIntegrationUpdate, clientIntegrationAdd, signatureSecret } from '../../service';
import TextArea from 'antd/lib/input/TextArea';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const FormDetail: React.FC<any> = (props) => {
  const [singnType, setSingnType] = useState('1');
  const [publicKeyPem, setPublicKeyPem] = useState('');

  const [form] = Form.useForm();
  const { data, onClose, onSuccess } = props;
  useEffect(() => {
    form.setFieldsValue({ appOS: '1', ...data, signingAlg: singnType, publicKeyPem });
  }, []);
  const onChangeSign = (value: any) => {
    setSingnType(value);
  };
  const onDone = (res: any) => {
    if (res.code === '0') {
      message.success('保存成功。');
      onSuccess();
      onClose();
    } else {
      message.error('保存失败。');
    }
  };
  const onFinish = async () => {
    if (data.id) {
      await clientIntegrationUpdate(data.clientId, form.getFieldsValue()).then(async (res) => {
        onDone(res);
      });
    } else {
      const formData = {
        tcode: sessionStorage.getItem('tcode'),
        ...form.getFieldsValue(),
      };
      await clientIntegrationAdd(formData).then(async (res) => onDone(res));
    }
  };
  const genaratePublicKeyPem = async () => {
    await signatureSecret(data.clientId).then(async (res) => {
      setPublicKeyPem(res.data.signature_secret);
      form.setFieldsValue({
        signatureSecret: res.data.signature_secret,
      });
      message.success('操作成功');
    });
  };

  const publicKeyPemItem = data.clientId && singnType === '1' && (
    <Row style={{ marginLeft: 70 }}>
      <Form.Item name="signatureSecret" label="签名密钥">
        <TextArea disabled style={{ height: 200, width: 240 }} />
      </Form.Item>
      <Button onClick={genaratePublicKeyPem}>生成密钥</Button>{' '}
    </Row>
  );

  return (
    <Form
      {...layout}
      form={form}
      initialValues={{ appOS: '1', ...data, signingAlg: singnType }}
      onFinish={onFinish}
    >
      <Form.Item name="clientName" label="应用名称" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="packageName" label="应用包名" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="appOS" label="平台" rules={[{ required: true }]}>
        <Select allowClear>
          <Option value="1">Android</Option>
          <Option value="2">iOS</Option>
        </Select>
      </Form.Item>
      <Form.Item name="signingAlg" label="通讯加密方式" rules={[{ required: true }]}>
        <Select allowClear onChange={onChangeSign}>
          <Option value="1">对称签名</Option>
          <Option value="2">非对称签名</Option>
        </Select>
      </Form.Item>
      {publicKeyPemItem}
      <Form.Item {...tailLayout}>
        <Button htmlType="button" style={{ marginRight: 20 }} onClick={onClose}>
          取消
        </Button>
        <Button type="primary" htmlType="submit">
          保存
        </Button>
      </Form.Item>
    </Form>
  );
};
export default FormDetail;
