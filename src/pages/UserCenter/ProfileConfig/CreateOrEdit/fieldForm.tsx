import { Button, Col, Space, Form, Input, Row, Select, Drawer } from 'antd';
import React, { useEffect } from 'react';
import _ from 'lodash';
import { getUIID, showErrorMessage } from '@/utils/common.utils';
import { validateName } from '@/utils/validator';
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const FieldForm: React.FC<any> = (props: any) => {
  const [formBasic] = Form.useForm();
  useEffect(() => {
    formBasic.setFieldsValue(
      props.data || {
        name: '',
        alias: '',
        type: 'STRING',
        description: '',
      },
    );
  }, [props.data]);
  const onCancel = () => {
    props.onCancel();
  };
  const onSubmit = (values) => {
    if (!props.data) {
      values.ui_id = getUIID();
    }
    const { alias } = values;

    const aliasList = (alias && ((typeof alias === 'string' && alias?.split(',')) || alias)) || [];
    values.alias = aliasList;
    if (aliasList.length > 5) {
      showErrorMessage('别名最多可以输入5个。');
      return;
    }
    props.onSubmit(values);
  };
  const validateUsername = function (_rule: any, value: string, callback: any) {
    validateName(_rule, value, callback, '字段格式不正确，允许输入英文字母、数字、下划线');
  };
  const renderBasicFormDefault = (readOnly) => {
    return (
      <Form form={formBasic} disabled={readOnly} onFinish={onSubmit}>
        <Row>
          <Col span="24">
            <FormItem
              name="name"
              label="字段名称"
              tooltip="允许输入英文字母、数字、下划线"
              rules={[{ required: true, message: '请输入' }, { validator: validateUsername }]}
              {...formItemLayout}
            >
              <Input type="text" />
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem
              name="alias"
              label="字段别名"
              {...formItemLayout}
              tooltip="多个换行逗号分隔即可，最多支持5个"
            >
              <Input.TextArea />
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem name="type" label="字段类型" {...formItemLayout}>
              <Select
                options={[
                  {
                    label: '字符串',
                    value: 'STRING',
                  },
                  {
                    label: '布尔型',
                    value: 'BOOLEAN',
                  },
                  {
                    label: '数字',
                    value: 'NUMBER',
                  },
                  {
                    label: '对象',
                    value: 'OBJECT',
                  },
                ]}
              />
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem name="description" label="字段描述" {...formItemLayout}>
              <Input.TextArea />
            </FormItem>
          </Col>
        </Row>
        {(!readOnly && (
          <div className="footerContainer">
            <Space>
              <Button type="ghost" className="ml-10" onClick={onCancel}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Space>
          </div>
        )) ||
          null}
      </Form>
    );
  };
  const render = () => {
    const { data } = props;
    const baseObj = _.find(props.baseData, {
      name: props.data?.name,
    });
    const readOnly = !!baseObj;
    return (
      <Drawer
        forceRender
        title={(data && ((readOnly && '查看字段') || '编辑字段')) || '新增字段'}
        onClose={props?.onCancel}
        open={props.open}
        destroyOnClose
        footer={null}
        width={500}
      >
        {renderBasicFormDefault(readOnly)}
      </Drawer>
    );
  };
  return render();
};
export default FieldForm;
