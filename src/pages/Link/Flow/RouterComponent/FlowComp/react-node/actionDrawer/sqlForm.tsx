import { Col, Form, Input, Button, Row, message, Popconfirm, Select } from 'antd';
import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { parserSql } from '@/pages/Link/Flow/service';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const SqlForm = (props: any, ref) => {
  const [formBasic] = Form.useForm();
  const [sqlValue, setSqlValue] = useState(props.sql || '');
  useImperativeHandle(ref, () => ({
    getData: () => {
      return formBasic.getFieldsValue();
    },
    addData: (newValue) => {
      const param = newValue || '';
      let newVal = sqlValue || '';
      newVal += param;
      setSqlValue(newVal);
      return formBasic.setFieldsValue({
        sql: newVal,
      });
    },
  }));
  const onAnalysis = async () => {
    // POST /iam/api/parserSql
    await parserSql({
      sql: sqlValue,
    }).then((res: any) => {
      message.success('参数解析成功');
      props.parserSqlSuccess(res);
    });
  };
  const renderBasicForm = () => {
    return (
      <Form form={formBasic}>
        <Row>
          <Col span="24">
            <FormItem
              name="type"
              label=""
              rules={[{ required: true, message: '请输入' }]}
              {...formItemLayout}
              initialValue={props.type || 'SELECT'}
            >
              <Select
                options={[
                  {
                    label: '查询',
                    value: 'SELECT',
                  },
                  {
                    label: '插入',
                    value: 'INSERT',
                  },
                  {
                    label: '更新',
                    value: 'UPDATE',
                  },
                  {
                    label: '删除',
                    value: 'DELETE',
                  },
                ]}
              />
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem
              name="sql"
              label="查询语句"
              rules={[{ required: true, message: '请输入' }]}
              {...formItemLayout}
              initialValue={sqlValue}
            >
              <Input.TextArea
                onChange={(e) => {
                  setSqlValue(e.target.value);
                }}
                onFocus={props.onFocus}
              />
            </FormItem>
          </Col>
          <Col span="24" style={{ textAlign: 'right' }}>
            <Popconfirm
              title="确定要进行参数解析吗？sql中参数辉替换到下面的入参映射中。"
              onConfirm={onAnalysis}
            >
              <Button type="primary">参数解析</Button>
            </Popconfirm>
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

export default forwardRef(SqlForm);
