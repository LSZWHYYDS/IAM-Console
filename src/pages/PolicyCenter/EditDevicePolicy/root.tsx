import { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Form, Switch, TreeSelect } from 'antd';

const FormItem = Form.Item;

export const Root = forwardRef((props: { data: any }, ref) => {
  const [form] = Form.useForm();
  const { data = {} } = props;

  useEffect(() => {
    form.setFieldsValue(data);
  });
  useImperativeHandle(ref, () => ({
    getValues: () => {
      return form.getFieldsValue();
    },
  }));
  const render = () => {
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form
        form={form}
        {...formItemLayout}
        className="formPadding policyForm"
        layout="horizontal"
        initialValues={data}
      >
        <FormItem name="check" label="是否启用" valuePropName="checked">
          <Switch />
        </FormItem>
        <FormItem {...formItemLayout} name="handle" label="违规处置">
          <TreeSelect
            placeholder="请选择"
            treeCheckable={true}
            treeData={[
              {
                label: '禁用钉钉',
                key: '1',
                value: '1',
              },
              {
                label: '擦除钉钉数据',
                key: '2',
                value: '2',
              },
            ]}
          />
        </FormItem>
      </Form>
    );
  };
  return render();
});
