import { Col, Form, Input, Radio, Row, Select, Button } from 'antd';
import React, { useImperativeHandle, useState, forwardRef } from 'react';
import { showErrorMessage, showSuccessMessage } from '@/utils/common.utils';
import { testDb } from '../service';
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};

const DbLinker = (props: any, ref) => {
  const [formBasic] = Form.useForm();
  const [dataInfo, setDataInfo] = useState<any>(props.data || {});
  useImperativeHandle(ref, () => ({
    getData: () => {
      return dataInfo;
    },
    getDataOnSave: async () => {
      const formData = await formBasic.validateFields();
      return formData;
    },
    setData: () => {
      setDataInfo(props.data);
      return formBasic.setFieldsValue(props.data);
    },
  }));

  const onFieldsChange = (changedFields: any, allFields: any) => {
    setDataInfo(allFields);
  };
  const onTest = async () => {
    const dataBaseInfo = await formBasic.validateFields();
    const p = testDb({ dataBaseInfo });
    p.then(() => {
      showSuccessMessage();
    }).catch((error: any) => {
      showErrorMessage('数据库连接失败：' + error.message);
    });
  };
  const renderBasicForm = () => {
    const obj = { ...dataInfo };
    if (!obj.type) {
      obj.type = 'Oracle';
    }
    if (!obj.encode) {
      obj.encode = 'utf8';
    }
    return (
      <Form form={formBasic} initialValues={obj} onValuesChange={onFieldsChange}>
        <Row>
          <Col span="24">
            <FormItem
              name="type"
              label="数据库类型"
              rules={[{ required: true, message: '请输入' }]}
              {...formItemLayout}
            >
              <Select
                options={[
                  {
                    label: 'Oracle',
                    value: 'ORACLE',
                  },
                  {
                    label: 'MySql',
                    value: 'MYSQL',
                  },
                  {
                    label: 'SQL Server',
                    value: 'SQLSERVER',
                  },
                  {
                    label: 'Postgre',
                    value: 'POSTGRESQL',
                  },
                ]}
              />
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem
              name="host"
              label="数据库地址"
              rules={[{ required: true, message: '请输入' }]}
              {...formItemLayout}
            >
              <Input />
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem
              name="port"
              label="数据库端口"
              rules={[{ required: true, message: '请输入' }]}
              {...formItemLayout}
            >
              <Input />
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem
              name="dbname"
              label="数据库名称"
              rules={[{ required: true, message: '请输入' }]}
              {...formItemLayout}
            >
              <Input />
            </FormItem>
          </Col>

          <Col span="24">
            <FormItem
              name="encode"
              label="数据库编码"
              rules={[{ required: true, message: '请输入' }]}
              {...formItemLayout}
            >
              <Radio.Group>
                <Radio value="utf8">utf8</Radio>
                <Radio value="utf8mb4">utf8mb4</Radio>
                <Radio value="gbk">gbk</Radio>
                <Radio value="latin1">latin1</Radio>
              </Radio.Group>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入' }]}
              {...formItemLayout}
            >
              <Input />
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入' }]}
              {...formItemLayout}
            >
              <Input.Password />
            </FormItem>
          </Col>
          <Col offset={5} span="20">
            <Button type="primary" onClick={onTest}>
              测试连接
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };
  const render = () => {
    return <div id="content">{renderBasicForm()}</div>;
  };
  return render();
};

export default forwardRef(DbLinker);
