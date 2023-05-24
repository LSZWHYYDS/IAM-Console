/* eslint-disable react-hooks/exhaustive-deps */
import { requestMsg } from '@/utils/common.utils';
import DynamicFieldSetOIDC from '@/components/DynamicFieldSet/indexOIDC';
// import PicturesWall from '@/components/ImageUploader';
import PicuresLogo from './components/UploadLogo';
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Tooltip,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { requestEnterpriseLogin } from '@/pages/AppCenter/AppList/service';
import { editPolicies, getPolicies } from './service';
import { useModel } from 'umi';

import styles from './EditPolicies.less';
const RadioGroup = Radio.Group;
const { Option } = Select;
const FormItem = Form.Item;
const { Panel } = Collapse;
const requiredFields = ['uc_name'];

const EditEnt: React.FC<any> = (props: any) => {
  const [form] = Form.useForm();
  const { refresh: refreshLayout } = useModel('@@initialState');

  const [policies, setPolicies] = useState<DIGITALSEE.ConfigsPolicies>();
  const [ucName, setUcName] = useState('');
  const [showCustomize, setShowCustomize] = useState(false);
  // 设置企业认证登录方式
  const [localSign, setLocalSign] = useState<any>([]);
  const [locals_third, setlocals_third] = useState<any>([]);

  const loadData = async () => {
    return await getPolicies().then(async (res) => {
      const policyInfo = res.data;
      setUcName(policyInfo.uc_name);
      policyInfo.builtin_auth_method.third_auth_methods = (
        policyInfo.builtin_auth_method.third_auth_methods || []
      ).map((item) => {
        return JSON.stringify(item);
      });
      policyInfo.builtin_auth_method.default_auth =
        policyInfo.builtin_auth_method.default_auth &&
        JSON.stringify(policyInfo.builtin_auth_method.default_auth);
      setPolicies(policyInfo);
      setShowCustomize(policyInfo.login_policy.sso_validity !== -1);
      setlocals_third(policyInfo.builtin_auth_method.third_auth_methods || []);

      const filterIsExistDefaultLoginType = (
        policyInfo.builtin_auth_method.third_auth_methods || []
      ).filter((fils) => {
        return (
          fils.indexOf(JSON.parse(policyInfo?.builtin_auth_method.default_auth || '{}').name) != -1
        );
      });
      if (!filterIsExistDefaultLoginType.length) {
        form.setFieldsValue({
          builtin_auth_method: Object.assign(
            {},
            policyInfo.builtin_auth_method.third_auth_methods,
            { default_auth: '' },
          ),
        });
      }
      form.setFieldsValue({
        uc_logo: policyInfo?.uc_logo,
      });
      props?.modifyLoadingStatus();
      return res;
    });
  };
  useEffect(() => {
    requestEnterpriseLogin().then((rs) => {
      setLocalSign(rs.data);
      loadData();
    });
  }, []);

  const getBuiltin_auth_method = (builtin_auth_method: any) => {
    const { local_auth_method, third_auth_methods, default_auth } = builtin_auth_method;
    const local_auth_methodObj = {
      pwd_enabled: local_auth_method.includes('pwd_enabled'),
      sms_enabled: local_auth_method.includes('sms_enabled'),
      email_enabled: local_auth_method.includes('email_enabled'),
    };
    const third_auth_methodsList = (third_auth_methods || []).map((item: string) => {
      return JSON.parse(item);
    });
    return {
      ...builtin_auth_method,
      local_auth_method: local_auth_methodObj,
      third_auth_methods: third_auth_methodsList,
      default_auth: JSON.parse(default_auth || '{}'),
    };
  };
  const onSubmit = () => {
    const { validateFields } = form;
    validateFields().then((values) => {
      const tempArr: any = [];
      for (const item in values) {
        if (item.indexOf('uris-') != -1) {
          tempArr.push(values[item]);
        }
      }
      if (values) {
        const policiesData = {
          uc_name: values.ucName,
          uc_logo: values.uc_logo || null,
          login_policy: {
            login_attrs: values.login_attrs,
            sso_validity:
              values.sso_validity_type === 'customize'
                ? parseInt(values.sso_validity, 10) * 60
                : -1,
            qrcode_enable: values.qrcode_enable,
            email_verify_validity: values.email_verify_validity || '5',
            message_verify_validity: values.message_verify_validity || '5',
          },
          selfservice: {
            allow_self_signup: values.allow_self_signup,
            allow_selfservice: true,
          },
          password_policy: {
            admin_reset_user_pwd: values.admin_reset_user_pwd,
            pwd_in_history: parseInt(values.pwd_in_history, 10),
            pwd_max_age: parseInt(values.pwd_max_age, 10),
            pwd_must_change_for_admin_reset_pwd: values.pwd_must_change_for_admin_reset_pwd,
            // 新增加三个属性
            continuous_failure_count: Number(values.access_lock),
            lock_duration: Number(values.access_lockss),
            white_list: tempArr,
          },
          pwd_complexity: {
            min_len: values.min_len,
            max_len: 20,
            require_lower_char: values.require_lower_char ? 1 : 0,
            require_num: values.require_num ? 1 : 0,
            require_spec_char: values.require_spec_char ? 1 : 0,
            require_upper_char: values.require_upper_char ? 1 : 0,
          },
          signup_policy: {
            mandatory_attrs: values.mandatory_attrs,
          },
          audit_policy: {
            max_age: parseInt(values.audit_policy_max_age, 10) * 24 * 60 * 60,
            audit_level: values.audit_level,
          },
          failed_login_alert_policy: {
            enabled: values.enable_login_failure_alert,
            notify_user: true, // for now , we hard code to always
            notify_admin: true, // for now, we hard code to always
          },
          cross_region_login_alert_policy: {
            enabled: values.enable_cross_region_login_alert,
            notify_user: true, // for now , we hard code to always
            notify_admin: true, // for now, we hard code to always
          },
          user_policy: {
            user_create_verify: values.userCreate,
            expire_remind_days: values.dueTo,
            cycle_remind_days: values.cycleTo,
          },
          builtin_auth_method: getBuiltin_auth_method(values.builtin_auth_method),
        };
        editPolicies(policiesData).then((res) => {
          sessionStorage.setItem('ucName', values.ucName);
          document.title = values.ucName;
          requestMsg(res);
          refreshLayout();
        });
      }
    });
  };
  const changeTimeoutType = (e: any) => {
    const show = e.target.value === 'customize';
    setShowCustomize(show);
    if (show) {
      requiredFields.push('sso_validity');
    } else {
      requiredFields.pop();
    }
  };
  const getLocalLogin = () => {
    if (!policies) return;
    const list = locals_third.map((value: string) => {
      return {
        value,
        label: JSON.parse(value).name,
      };
    });
    return list;
  };
  const handleqiyeFunc = (values: any) => {
    setlocals_third(values);
  };
  const valueConverter = (initVal: number | undefined) => {
    return initVal === 1 || initVal === undefined;
  };
  const renderLoginConsole = (builtin_auth_method: any) => {
    const { local_auth_method } = builtin_auth_method;
    const local_auth_methods: any = [];
    if (local_auth_method.pwd_enabled) {
      local_auth_methods.push('pwd_enabled');
    }
    if (local_auth_method.sms_enabled) {
      local_auth_methods.push('sms_enabled');
    }
    if (local_auth_method.email_enabled) {
      local_auth_methods.push('email_enabled');
    }
    return (
      <Panel header="管理平台登录控制" key="loginConsole">
        <Row>
          <Col span={12}>
            <FormItem
              name={['builtin_auth_method', 'local_auth_method']}
              label="本地登陆方式"
              initialValue={local_auth_methods}
              labelCol={{ span: 8 }}
            >
              <Select mode="multiple" showArrow placeholder="请选择本地登录方式">
                <Option value="pwd_enabled" disabled>
                  IAM用户名密码
                </Option>
                <Option value="sms_enabled">短信验证码</Option>
                <Option value="email_enabled">邮箱验证码</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              name={['builtin_auth_method', 'mfa']}
              label="多因子认证"
              labelCol={{ span: 8 }}
              initialValue={builtin_auth_method?.mfa}
            >
              <Select mode="multiple" showArrow placeholder="请选择多因子认证登录方式">
                <Option value="SMS">短信验证码</Option>
                <Option value="EMAIL">邮箱验证码</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              name={['builtin_auth_method', 'third_auth_methods']}
              label="企业认证登录"
              initialValue={builtin_auth_method.third_auth_methods}
              labelCol={{ span: 8 }}
            >
              <Select
                mode="multiple"
                showArrow
                placeholder="请选择企业认证登录方式"
                onChange={handleqiyeFunc}
              >
                {localSign.map((element: any) => {
                  return (
                    <Option value={JSON.stringify(element)} key={element.auth_id}>
                      {element.name}
                    </Option>
                  );
                })}
              </Select>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              name={['builtin_auth_method', 'default_auth']}
              label="默认登陆方式"
              initialValue={builtin_auth_method.default_auth}
              labelCol={{ span: 8 }}
            >
              <Select options={getLocalLogin()} allowClear placeholder="请选择默认登录方式" />
            </FormItem>
          </Col>
        </Row>
      </Panel>
    );
  };
  const render = () => {
    if (!policies || !policies.signup_policy) {
      return <div />;
    }
    const {
      password_policy,
      pwd_complexity,
      signup_policy,
      login_policy,
      audit_policy,
      user_policy,
      builtin_auth_method,
    } = policies || {};

    const { mandatory_attrs } = signup_policy || {};
    const { sso_validity, message_verify_validity, email_verify_validity, login_attrs } =
      login_policy || {};
    const { max_age: audit_policy_max_age, audit_level } = audit_policy || {};

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    return (
      <div id="content" className="content">
        <Form form={form} layout="horizontal" {...formItemLayout}>
          <Collapse
            bordered={false}
            defaultActiveKey={[
              'basicinfo',
              'pwdPolicy',
              'audit',
              'userPolicy',
              'loginPolicy',
              'loginConsole',
            ]}
          >
            <Panel header="基本内容" key="basicinfo">
              <Row>
                <Col span={12}>
                  <FormItem
                    name="ucName"
                    label="平台名称"
                    rules={[{ required: true, message: '请输入平台名称' }]}
                    initialValue={ucName}
                  >
                    <Input type="text" maxLength={12} />
                  </FormItem>
                  <FormItem
                    name="mandatory_attrs"
                    label="用户必填属性"
                    initialValue={mandatory_attrs}
                  >
                    <Select mode="multiple" style={{ width: '100%' }}>
                      <Option key="username" value="username" disabled>
                        用户名
                      </Option>
                      <Option key="password" value="password" disabled>
                        密码
                      </Option>
                      <Option key="email" value="email">
                        邮箱
                      </Option>
                      <Option key="name" value="name">
                        姓名
                      </Option>
                      <Option key="nickname" value="nickname">
                        昵称
                      </Option>
                      <Option key="gender" value="gender">
                        性别
                      </Option>
                      <Option key="phone_number" value="phone_number">
                        手机号
                      </Option>
                      <Option key="start_time" value="start_date">
                        开始时间和结束时间
                      </Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="Logo" name="uc_logo" shouldUpdate extra="图片最大50k">
                    {}
                    <PicuresLogo maxSize={60} />
                  </FormItem>
                </Col>
              </Row>
            </Panel>
            <Panel header="用户策略" key="userPolicy">
              <Row>
                <Col span={12}>
                  <FormItem
                    name="userCreate"
                    label="用户创建审核"
                    rules={[{ required: true, message: '请选择状态' }]}
                    initialValue={user_policy?.user_create_verify}
                  >
                    <Radio.Group>
                      <Radio value={true}>开启</Radio>
                      <Radio value={false}>关闭</Radio>
                    </Radio.Group>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12} className={styles.formdueto}>
                  <FormItem
                    name="dueTo"
                    label="到期提醒"
                    rules={[{ required: true, message: '请输入到期提醒' }]}
                    initialValue={user_policy?.expire_remind_days}
                    style={{ width: '100%' }}
                  >
                    <InputNumber addonAfter={'天'} min={0} />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12} className={styles.formdueto}>
                  <FormItem
                    name="cycleTo"
                    label="提醒周期"
                    rules={[{ required: true, message: '请输入周期提醒' }]}
                    initialValue={user_policy?.cycle_remind_days}
                  >
                    <InputNumber addonAfter={'天'} min={0} />
                  </FormItem>
                </Col>
              </Row>
            </Panel>
            <Panel header="密码策略" key="pwdPolicy">
              <Row>
                <Col span={12}>
                  <FormItem label="密码复杂度">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ marginBottom: 10 }}>
                        <FormItem
                          name="require_num"
                          valuePropName="checked"
                          initialValue={valueConverter(pwd_complexity.require_num)}
                        >
                          <Checkbox>包含数字</Checkbox>
                        </FormItem>
                      </div>
                      <div style={{ marginBottom: 10 }}>
                        <FormItem
                          name="require_upper_char"
                          valuePropName="checked"
                          initialValue={valueConverter(pwd_complexity.require_upper_char)}
                        >
                          <Checkbox>包含大写字母</Checkbox>
                        </FormItem>
                      </div>
                      <div style={{ marginBottom: 10 }}>
                        <FormItem
                          name="require_lower_char"
                          valuePropName="checked"
                          initialValue={valueConverter(pwd_complexity.require_lower_char)}
                        >
                          <Checkbox>包含小写字母</Checkbox>
                        </FormItem>
                      </div>
                      <div>
                        <FormItem
                          name="require_spec_char"
                          valuePropName="checked"
                          initialValue={valueConverter(pwd_complexity.require_spec_char)}
                        >
                          <Checkbox>包含特殊字符</Checkbox>
                        </FormItem>
                      </div>
                    </div>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    name="min_len"
                    label="密码最短长度"
                    rules={[{ required: true, message: '请输入密码最短长度' }]}
                    initialValue={pwd_complexity.min_len}
                  >
                    <InputNumber min={6} max={20} />
                  </FormItem>
                  <FormItem
                    name="admin_reset_user_pwd"
                    label="管理员重置密码"
                    valuePropName="checked"
                    initialValue={
                      password_policy.admin_reset_user_pwd === undefined
                        ? false
                        : password_policy.admin_reset_user_pwd
                    }
                  >
                    <Checkbox>启用</Checkbox>
                  </FormItem>
                  <FormItem
                    name="pwd_must_change_for_admin_reset_pwd"
                    label={
                      <Tooltip title="如果勾选，由管理员设置或重置的密码，用户首次登录必须修改密码。由AD/LDAP同步的用户不受此限制。">
                        <span>首次登录修改密码</span>
                      </Tooltip>
                    }
                    valuePropName="checked"
                    initialValue={
                      password_policy.pwd_must_change_for_admin_reset_pwd === undefined
                        ? false
                        : password_policy.pwd_must_change_for_admin_reset_pwd
                    }
                  >
                    <Checkbox>启用</Checkbox>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem label="账号锁定-连续无效登录">
                    <Row>
                      <Col span={24}>
                        <div style={{ display: 'flex', alignContent: 'center' }}>
                          <FormItem
                            name="access_lock"
                            initialValue={password_policy?.continuous_failure_count || 1}
                            style={{ width: '100%' }}
                          >
                            <InputNumber addonAfter={'次'} style={{ width: '100%' }} min={1} />
                          </FormItem>
                        </div>
                      </Col>
                    </Row>
                  </FormItem>
                </Col>
                <Col span={12} className={styles.formdueto}>
                  <FormItem
                    name="access_lockss"
                    label={<span style={{ color: '#808080' }}>锁定账号</span>}
                    initialValue={password_policy?.lock_duration || 1}
                  >
                    <InputNumber addonAfter={'分钟'} min={1} />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <DynamicFieldSetOIDC
                    dataArr={password_policy?.white_list ?? []}
                    labelSpan={8}
                    wrapperSpan={15}
                    isShowAdress={true}
                    col={false}
                    label={<span title="免锁定IP白名单">{'免锁定IP白名单:'}</span>}
                  />
                </Col>
              </Row>
            </Panel>
            <Panel header="登录策略" key="loginPolicy">
              <Row>
                <Col span={12}>
                  <FormItem
                    name="sso_validity_type"
                    label="SSO会话有效期"
                    initialValue={sso_validity === -1 ? 'closeBrowserExpire' : 'customize'}
                  >
                    <RadioGroup onChange={changeTimeoutType}>
                      <Radio value="customize">自定义</Radio>
                      <Radio value="closeBrowserExpire">关闭浏览器后立即失效</Radio>
                    </RadioGroup>
                  </FormItem>
                </Col>
                {showCustomize && (
                  <Col span={12}>
                    <FormItem
                      name="sso_validity"
                      label="时间"
                      rules={[{ required: true, message: '请输入时间' }]}
                      initialValue={sso_validity > 0 ? sso_validity / 60 : ''}
                    >
                      <Input type="number" addonAfter={'分钟'} min={1} max={3000000} />
                    </FormItem>
                  </Col>
                )}
              </Row>
              <Row>
                <Col span={12} className={styles.formdueto}>
                  <FormItem
                    name="message_verify_validity"
                    label="短信验证码有效期"
                    initialValue={message_verify_validity || '5'}
                  >
                    <InputNumber min={1} max={100} addonAfter="分" />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    name="login_attrs"
                    label="登录属性"
                    initialValue={login_attrs}
                    rules={[{ required: true }]}
                  >
                    <Select
                      mode="multiple"
                      showArrow
                      placeholder="请选择登录属性"
                      options={[
                        {
                          label: '用户名',
                          value: 'username',
                        },
                        {
                          label: '邮箱',
                          value: 'email',
                        },
                        {
                          label: '手机号',
                          value: 'phone_number',
                        },
                        {
                          label: '工号',
                          value: 'user_job_number',
                        },
                      ]}
                    />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12} className={styles.formdueto}>
                  <FormItem
                    name="email_verify_validity"
                    label="邮件验证码有效期"
                    initialValue={email_verify_validity || '5'}
                  >
                    <InputNumber min={1} max={100} addonAfter="分" />
                  </FormItem>
                </Col>
              </Row>
            </Panel>
            {renderLoginConsole(builtin_auth_method)}
            <Panel header="审计监控" key="audit">
              <Row>
                <Col span={12}>
                  <FormItem
                    name="audit_level"
                    label="日志级别"
                    initialValue={audit_level || 'INFO'}
                    labelCol={{ span: 8 }}
                  >
                    <Select>
                      <Option value="OFF">关闭</Option>
                      <Option value="ERROR">错误</Option>
                      <Option value="INFO">信息</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    name="audit_policy_max_age"
                    label="日志保存时间"
                    rules={[{ required: true, message: '请输入日志保存时间' }]}
                    initialValue={
                      audit_policy_max_age > 0 ? audit_policy_max_age / 24 / 60 / 60 : 30
                    }
                    labelCol={{ span: 8 }}
                  >
                    <Input type="number" addonAfter={'天'} min={3} max={90} />
                  </FormItem>
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </Form>
        <div className="footerContainer">
          <Button type="primary" onClick={onSubmit}>
            保存
          </Button>
        </div>
      </div>
    );
  };
  return render();
};

export default EditEnt;
