// 登录页-忘记密码-重置密码
import styles from '@/pages/Account/Login/index.less';
import { getConfigsPolicies } from '@/services/digitalsee/api';
import { updatePwd, updatePwdAfterForget } from '@/services/userMgrAPI';
import { showErrorMessage } from '@/utils/common.utils';
import { Button, Card, Col, Form, Input, message, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { history } from 'umi';

const FormItem = Form.Item;
export interface ResetPasswordProps {
  username: string;
  reset_password_token?: string;
  tcode?: string;
  inDlg?: boolean;
  onClose: () => void;
}

const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const ResetPasswordForm: React.FC<ResetPasswordProps> = (props) => {
  const { username, reset_password_token, tcode, inDlg, onClose } = props;
  const [form] = Form.useForm();
  const [configsPolicies, setConfigsPolicies] = useState<DIGITALSEE.ConfigsPolicies>();

  const handleGetConfigsPolicy = async () => {
    const configsPolicy = await getConfigsPolicies();
    if (configsPolicy.error === '0') {
      setConfigsPolicies(configsPolicy.data);
    }
  };
  const onSave = async (values: any) => {
    if (values.new_password !== values.new_password1) {
      message.error('两次输入密码不一致。');
      return;
    }
    delete values.new_password1;
    const obj = (reset_password_token && {
      reset_password_token,
      tcode,
      ...values,
    }) || {
      username: username || sessionStorage.getItem('loginId'),
      ...values,
    };
    let result;
    console.log('reset_password_token', reset_password_token);
    if (reset_password_token) {
      result = await updatePwdAfterForget(obj);
    } else {
      result = await updatePwd(obj);
    }
    console.log('result', result);
    if (result.error === '0') {
      message.success('操作成功。');
      onClose();
    } else {
      console.log('error', result.error);
      showErrorMessage(result);
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
        const mainArr: any = [];
        const strArr: any = [];
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
  const toLogin = () => {
    history.push({
      pathname: `/user/login`,
    });
  };
  const span = (inDlg && 16) || 6;
  const offset = (inDlg && 4) || 8;
  return (
    <Form form={form} {...formLayout} onFinish={onSave}>
      <Card title="修改密码">
        <div className={styles.top}>
          <div className={styles.header}>
            <img
              alt="logo"
              className={styles.logo}
              style={{ background: '#FAFAFA', borderRadius: '8px', padding: '8px' }}
              src={
                configsPolicies?.uc_logo
                  ? configsPolicies?.uc_logo
                  : require('@/../public/images/favicon.png')
              }
            />
            <span className={styles.title}>
              <span className={styles.hint}>数犀</span>
              <span className={styles.lead}>{sessionStorage.getItem('ucName')}</span>
            </span>
          </div>
        </div>
        <Row gutter={[16, 16]}>
          <Col offset={offset} span={span}>
            <FormItem
              label="旧密码"
              name="old_password"
              rules={[{ required: true, message: '请输入密码' }]}
              shouldUpdate
            >
              <Input.Password />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col offset={offset} span={span}>
            <FormItem
              label="新密码"
              name="new_password"
              rules={[
                { required: true, message: '请输入密码' },
                { validator: validatePassword(configsPolicies?.pwd_complexity) },
              ]}
              shouldUpdate
            >
              <Input.Password />
            </FormItem>
            <FormItem
              label="确认新密码"
              name="new_password1"
              rules={[
                { required: true, message: '请再次输入密码' },
                { validator: validatePassword(configsPolicies?.pwd_complexity) },
              ]}
              shouldUpdate
            >
              <Input.Password />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col offset={6} span={8}>
            <FormItem wrapperCol={{ span: 16, offset: 16 }}>
              <Button key="SAVE" type="primary" htmlType="submit">
                重置密码
              </Button>
            </FormItem>
          </Col>
        </Row>
        {!inDlg && (
          <Row>
            <Col offset={13} span={5}>
              <a onClick={toLogin}>返回登录</a>
            </Col>
          </Row>
        )}
      </Card>
    </Form>
  );
};
export default ResetPasswordForm;
