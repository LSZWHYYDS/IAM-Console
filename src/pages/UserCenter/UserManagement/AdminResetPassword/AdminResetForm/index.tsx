import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Col, Row, message } from 'antd';
import { adminResetUserPwd } from '@/services/userMgrAPI';
import { getConfigsPolicies } from '@/services/digitalsee/api';
const FormItem = Form.Item;
export interface ResetPasswordProps {
  username: string;
  onClose: () => void;
}
const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const AdminResetForm: React.FC<ResetPasswordProps> = (props) => {
  const { username, onClose } = props;
  const [form] = Form.useForm();
  const [configsPolicies, setConfigsPolicies] = useState<DIGITALSEE.ConfigsPolicies>();
  const handleGetConfigsPolicy = async () => {
    const configsPolicy = await getConfigsPolicies();
    if (configsPolicy.error === '0') {
      setConfigsPolicies(configsPolicy.data);
    }
  };
  const onSave = async (values: any) => {
    const result = await adminResetUserPwd({
      username: username || sessionStorage.getItem('loginId'),
      password: values.password,
    });
    if (result.error === '0') {
      message.success('操作成功。');
      onClose();
    }
  };
  useEffect(() => {
    handleGetConfigsPolicy();
  }, [username]);
  const validatePassword = function (customizeRules?: DIGITALSEE.PasswordComplexity) {
    return function (_rule: any, value: string, callback: any) {
      const regExpObj = {
        require_num: /\d/,
        require_spec_char: /[\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^_\`\{\|\}\~]/,
        require_upper_char: /[A-Z]/,
        require_lower_char: /[a-z]/,
      };
      if (value && customizeRules) {
        const mainArr = [];
        const strArr = [];
        const lenPattern = new RegExp(`^.{${customizeRules.min_len},${customizeRules.max_len}}$`);
        const spacePattern = /\s/;
        if (!lenPattern.test(value)) {
          if (customizeRules.min_len !== customizeRules.max_len) {
            mainArr.push(`请输入${customizeRules.min_len}-${customizeRules.max_len}个字符`);
          } else {
            mainArr.push(`请输入${customizeRules.min_len}个字符`);
          }
        }
        if (spacePattern.test(value)) {
          mainArr.push(`不允许输入空格`);
        }
        for (const key in regExpObj) {
          if (regExpObj.hasOwnProperty(key) && customizeRules[key] === 1) {
            if (!regExpObj[key].test(value)) {
              switch (key) {
                case 'require_num':
                  strArr.push('数字');
                  break;
                case 'require_spec_char':
                  strArr.push('特殊字符');
                  break;
                case 'require_upper_char':
                  strArr.push('大写字母');
                  break;
                case 'require_lower_char':
                  strArr.push('小写字母');
              }
            }
          }
        }
        if (strArr.length !== 0) {
          strArr[0] = `还需包含${strArr[0]}`;
          mainArr.push(strArr.join('、'));
        }
        if (mainArr.length === 0) {
          callback();
        } else {
          callback(mainArr.join('；'));
        }
      } else {
        callback();
      }
    };
  };
  return (
    <Form form={form} {...formLayout} onFinish={onSave}>
      <Row gutter={[16, 16]}>
        <Col span={22}>
          <FormItem
            label="密码"
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { validator: validatePassword(configsPolicies?.pwd_complexity) },
            ]}
            shouldUpdate
          >
            <Input.Password />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <FormItem wrapperCol={{ span: 16, offset: 8 }}>
            <Button key="SAVE" type="primary" htmlType="submit">
              保存
            </Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
};
export default AdminResetForm;
