import { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Form, Switch, TreeSelect, Select } from 'antd';
import _ from 'lodash';

const FormItem = Form.Item;
const { Option } = Select;

export const LowerVersion = forwardRef(
  (props: { androidWrappConf: any; iosWrappConf: any }, ref) => {
    const [form] = Form.useForm();
    const androidList = '6.0/7.0/7.1/8.0/8.1/9.0/9.1/10.0/11.0'.split('/');
    const iosList =
      '10.0/10.1/10.2/10.3/11.0/11.1/11.2/11.3/12.0/12.1/13.0/13.1/13.2/13.3/13.4/13.5/13.6/13.7/14.0/14.1/14.2/14.3'.split(
        '/',
      );
    const { androidWrappConf = {}, iosWrappConf = {} } = props;
    useEffect(() => {
      form.setFieldsValue({
        check: androidWrappConf.check,
        'androidWrappConf.params.version': _.get(androidWrappConf, 'params.version', '6.0'),
        'iosWrappConf.params.version': _.get(iosWrappConf, 'params.version', '6.0'),
        handle: androidWrappConf.handle,
      });
    }, [androidWrappConf, iosWrappConf]);
    useImperativeHandle(ref, () => ({
      getValues: () => {
        const formData = form.getFieldsValue();
        const result = {
          androidWrappConf: {
            check: formData.check,
            handle: formData.handle,
            params: {
              version: formData['androidWrappConf.params.version'],
            },
            threatName: 'osVersion',
          },
          iosWrappConf: {
            check: formData.check,
            handle: formData.handle,
            params: {
              version: formData['iosWrappConf.params.version'],
            },
            threatName: 'osVersion',
          },
        };
        return result;
      },
    }));
    const render = () => {
      const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 6 },
      };
      return (
        <Form
          form={form}
          {...formItemLayout}
          className="formPadding policyForm"
          layout="horizontal"
        >
          <FormItem name="check" label="是否启用" valuePropName="checked">
            <Switch />
          </FormItem>
          <FormItem name="androidWrappConf.params.version" label="Android系统版本低于">
            <Select>
              {androidList.map((item, index) => (
                <Option value={`${index}`} key={item}>
                  {item}
                </Option>
              ))}
            </Select>
          </FormItem>
          <FormItem name="iosWrappConf.params.version" label="iOS系统版本低于">
            <Select>
              {iosList.map((item, index) => (
                <Option value={`${index}`} key={item}>
                  {item}
                </Option>
              ))}
            </Select>
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
  },
);
