import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Space } from 'antd';
import React, { useImperativeHandle } from 'react';

const ConditionList: React.FC = (props: any, ref) => {
  const dataSource = (props.list.length && props.list) || [];
  const [form] = Form.useForm();
  const { fieldList = [] } = props;
  //引用此组件 因为这里报错
  useImperativeHandle(ref, () => ({
    getData: () => {
      return form.validateFields();
      // return [];
    },
  }));

  return (
    <Form form={form} name="condForm" autoComplete="off" initialValues={dataSource}>
      <Form.List name="condList">
        {(fields, { add, remove }) => (
          <>
            <Form.Item>
              <Button
                type="primary"
                style={{ width: 200 }}
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                添加配置项
              </Button>
            </Form.Item>
            {fields.map((field) => (
              <Space key={field.key} align="baseline">
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, curValues) =>
                    prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                  }
                >
                  {() => (
                    <Form.Item
                      {...field}
                      name={[field.name, 'path']}
                      rules={[{ required: true, message: '参数必填' }]}
                    >
                      <Select style={{ width: 130 }} options={fieldList} />
                    </Form.Item>
                  )}
                </Form.Item>
                <Form.Item
                  {...field}
                  name={[field.name, 'eq']}
                  rules={[{ required: true, message: '操作符必填' }]}
                >
                  <Select
                    style={{ width: 130 }}
                    options={[
                      {
                        label: '等于',
                        value: 'eq',
                      },
                      {
                        labbel: '包含',
                        value: 'in',
                      },
                      {
                        labbel: 'co',
                        value: 'co',
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  {...field}
                  name={[field.name, 'value']}
                  rules={[{ required: true, message: '值必填' }]}
                >
                  <Input style={{ width: 330 }} />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(field.name)} />
              </Space>
            ))}
          </>
        )}
      </Form.List>
    </Form>
  );
};

export default ConditionList;
