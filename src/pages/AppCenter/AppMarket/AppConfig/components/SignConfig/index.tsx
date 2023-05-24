import { Form, Input, Select, Checkbox, Radio, Row, Col, Spin } from 'antd';
import { forwardRef, useState, useImperativeHandle, useEffect } from 'react';
const { Option } = Select;
import { requestEnterpriseLogin } from '../../servers';
import styles from './index.less';
/**
 * 登录配置组件
 */
export default forwardRef((props: any, ref) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  // 设置企业认证登录方式
  const [localSign, setLocalSign] = useState<any>([]);
  const [locals, setLocals] = useState<any>([]);
  const [locals_third, setlocals_third] = useState<any>([]);
  const [newPropss, setNewPropss] = useState<any>(null);

  const objs_ls = {
    pwd_enabled: {
      auth_type: 'PWD',
      auth_id: -1,
      name: 'IAM 用户名密码',
    },
    sms_enabled: {
      auth_type: 'SMS',
      auth_id: -1,
      name: '短信验证码',
    },
    email_enabled: {
      auth_type: 'EMAIL',
      auth_id: -1,
      name: '邮箱验证码',
    },
  };

  const Av = props?.rs ? JSON.stringify(props?.rs?.login_policy?.default_auth) : '';
  useEffect(() => {
    requestEnterpriseLogin().then((rs) => {
      setLocalSign(rs.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setNewPropss(JSON.parse(JSON.stringify(props)));
  }, [loading]);

  form.setFieldsValue({
    ds_name: props.rs ? props?.rs?.config?.ds_name : '',
    token_url: props.rs ? props?.rs?.config?.token_url : '',
    client_id: props.rs ? props?.rs?.config?.client_id : '',
    sso_url: props.rs ? props?.rs?.config?.sso_url : '',
    security: props.rs ? props?.rs?.config?.security : '',
    redirect_uri: props.rs ? props?.rs?.config?.redirect_uri : '',
    lang_code: props.rs ? props?.rs?.config?.lang_code : '',
    busi_center_code: props.rs ? props?.rs?.config?.busi_center_code : '',
    user_code_mapping_attr: props.rs ? props?.rs?.config?.user_code_mapping_attr : '',
    default_auth: Av ? Av.replaceAll('/', '') : '',
    mfa: props.rs ? props?.rs?.login_policy?.mfa : '',
    //新增云星空
    db_id: props.rs ? props?.rs?.config?.db_id : '',
    app_secret: props.rs ? props?.rs?.config?.app_secret : '',
    app_id: props.rs ? props?.rs?.config?.app_id : '',
    lc_id: props?.rs?.config?.lc_id ? props?.rs?.config?.lc_id : '2052',
    origin_type: props?.rs?.config?.origin_type ? props?.rs?.config?.origin_type : 'SimPas',
  });

  useEffect(() => {
    const arr: any = [];
    for (const i in props?.rs?.login_policy?.local_auth_method) {
      if (props?.rs?.login_policy?.local_auth_method[i]) {
        arr.push(JSON.stringify(objs_ls[i]));
      }
    }
    setLocals(arr);
    form.setFieldsValue({
      local_auth_method: arr,
    });
    const arrs: any = [];
    props?.rs?.login_policy?.third_auth_methods?.forEach((rs: any) => {
      arrs.push(JSON.stringify(rs));
    });
    setlocals_third(arrs);
    form.setFieldsValue({
      third_auth_methods: arrs,
    });
  }, [newPropss]);
  const handleFunc = () => {
    form.submit();
  };

  const setDisabledFunc = () => {
    sessionStorage.setItem('saveData_Two', String(true));
  };

  useImperativeHandle(ref, () => {
    return {
      handleFunc,
      setDisabledFunc,
    };
  });

  const onFinish_Sign = (value: any) => {
    // 对本地进行处理
    const default_handle = value?.local_auth_method ? value?.local_auth_method : [];
    const a: any = [];
    default_handle.forEach((forIs: any) => {
      try {
        a.push(JSON.parse(forIs));
      } catch (e) {
        new Error('参数错误');
      }
    });

    let objs = {
      email_enabled: false,
      pwd_enabled: false,
      sms_enabled: false,
    };
    a.forEach((is: any) => {
      if (is.name == 'IAM 用户名密码') {
        objs = {
          ...objs,
          pwd_enabled: true,
        };
      } else if (is.name == '短信验证码') {
        objs = {
          ...objs,
          sms_enabled: true,
        };
      } else {
        objs = {
          ...objs,
          email_enabled: true,
        };
      }
    });

    setTimeout(() => {
      // 默认处理
      const defaults = value?.default_auth
        ? JSON.parse(value.default_auth || '{}')
        : value?.default_auth;
      // 企业认证处理
      // 再次判断如果是单个则自行处理成数组格式
      if (Array.isArray(value?.third_auth_methods)) {
        value.third_auth_methods = value?.third_auth_methods;
      } else {
        value.third_auth_methods = [value?.third_auth_methods];
      }
      const qiyes = value?.third_auth_methods
        ? value?.third_auth_methods?.map((filIs: any) => {
            return JSON.parse(filIs || '{}');
          })
        : '';

      // 删除多余属性
      const itmeArr = ['local_auth_method', 'mfa', 'third_auth_methods', 'default_auth'];

      const configObjs = {};

      for (const items in value) {
        if (!itmeArr.includes(items)) {
          configObjs[items] = value[items];
        }
      }

      props.handleSignConfig_(
        {
          ...configObjs,
        },
        {
          local_auth_method: objs ? objs : {}, //firstOBJ, // 本地处理
          default_auth: defaults ? defaults : {},
          third_auth_methods: qiyes ? qiyes : [],
          mfa: value.mfa ? value.mfa : [],
        },
      );
    }, 300);
  };

  // 保存组件状态
  // const initialFunc = () => {
  //   if (props.status) {
  //     const {
  //       dataOrigin,
  //       entrance,
  //       getAccess,
  //       language,
  //       redirectUrl,
  //       systemCode,
  //       theKey,
  //       userCode,
  //       zhangSetCode,
  //     } = props.status;
  //     return {
  //       dataOrigin,
  //       entrance,
  //       getAccess,
  //       language,
  //       redirectUrl,
  //       systemCode,
  //       theKey,
  //       userCode,
  //       zhangSetCode,
  //     };
  //   }
  //   return;
  // };

  // 数组对象去重
  const arr_ls = (arr: any) => {
    return arr.filter((item: any, index: any, arrs: any) => {
      return (
        arrs.findIndex((el: any) => JSON.parse(el)['name'] == JSON.parse(item)['name']) == index
      );
    });
  };

  const handleqiyeFunc = (values: any) => {
    // console.log(locals.concat(locals_third));
    setlocals_third(values);
  };
  const handleLocalFunc = (values: any) => {
    // console.log(locals.concat(locals_third));
    setLocals(values);
  };

  return (
    <Spin spinning={loading} style={{ background: '#fff', maxHeight: 'unset' }}>
      <Form
        className={styles.headAreaSelect}
        name="basic"
        onFinish={onFinish_Sign}
        autoComplete="off"
        style={{ paddingBottom: '50px' }}
        form={form}
      >
        <Row>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 20 }}
              labelAlign="right"
              label="本地登陆方式:"
              name="local_auth_method"
            >
              <Checkbox.Group
                onChange={handleLocalFunc}
                style={{
                  width: '100%',
                  marginLeft: '8px',
                }}
              >
                <Checkbox
                  value={JSON.stringify({
                    auth_type: 'PWD',
                    auth_id: -1,
                    name: 'IAM 用户名密码',
                  })}
                  style={{ width: '30%', marginLeft: 'unset' }}
                >
                  IAM 用户名密码
                </Checkbox>
                <Checkbox
                  value={JSON.stringify({
                    auth_type: 'SMS',
                    auth_id: -1,
                    name: '短信验证码',
                  })}
                  style={{ width: '30%', marginLeft: 'unset' }}
                >
                  短信验证码
                </Checkbox>
                <Checkbox
                  value={JSON.stringify({
                    auth_type: 'EMAIL',
                    auth_id: -1,
                    name: '邮箱验证码',
                  })}
                  style={{ width: '30%', marginLeft: 'unset' }}
                >
                  邮箱验证码
                </Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </Col>
        </Row>

        <Row wrap>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 20 }}
              labelAlign="right"
              label="企业认证登录:"
              name="third_auth_methods"
            >
              <Checkbox.Group
                onChange={handleqiyeFunc}
                style={{
                  width: '100%',
                  marginLeft: '8px',
                }}
              >
                {localSign.map((element: any, index: number) => {
                  return (
                    <Checkbox
                      value={JSON.stringify(element)}
                      style={{
                        width: '30%',
                        marginBottom: '20px',
                        marginLeft: 'unset',
                      }}
                      key={index}
                    >
                      {element.name}
                    </Checkbox>
                  );
                })}
              </Checkbox.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 20 }}
              labelAlign="right"
              label="多因子认证:"
              name="mfa"
              style={{ marginTop: '-20px' }}
            >
              <Checkbox.Group
                style={{
                  width: '100%',
                  marginLeft: '8px',
                }}
              >
                <Checkbox
                  value="SMS"
                  style={{
                    width: '30%',
                    marginBottom: '20px',
                    marginLeft: 'unset',
                  }}
                >
                  短信验证码
                </Checkbox>
                <Checkbox
                  value="EMAIL"
                  style={{
                    width: '30%',
                    marginBottom: '20px',
                    marginLeft: 'unset',
                  }}
                >
                  邮箱验证码
                </Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row wrap>
          <Col span={24}>
            {/* {arr_ls(firstA.concat(firstB, totalArr)).length ? ( */}
            {arr_ls(locals.concat(locals_third)).length ? (
              <Form.Item
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 20 }}
                labelAlign="right"
                label="默认登录方式:"
                name="default_auth"
              >
                <Radio.Group
                  style={{
                    width: '100%',
                    marginTop: '5px',
                    marginLeft: '8px',
                  }}
                >
                  {/* {arr_ls(firstA.concat(firstB)).map((mapIs: any, mapIx: number) => ( */}
                  {locals.concat(locals_third).map((mapIs: any, mapIx: number) => (
                    <Radio
                      value={JSON.stringify({
                        auth_type: JSON.parse(mapIs).auth_type,
                        auth_id: `${JSON.parse(mapIs).auth_id}`,
                        name: JSON.parse(mapIs).name,
                      })}
                      style={{
                        width: '30%',
                        marginBottom: '20px',
                        marginLeft: 'unset',
                      }}
                      key={mapIx}
                    >
                      {JSON.parse(mapIs).name}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            ) : (
              ''
            )}
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 10 }}
              labelAlign="right"
              label="数据源名称"
              name="ds_name"
              rules={[{ required: true, message: '请输入数据源名称' }]}
            >
              <Input bordered={true} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 10 }}
              labelAlign="right"
              label="获取AccessToken的url"
              name="token_url"
              rules={[{ required: true, message: '请输入AccessTokenUrl' }]}
            >
              <Input bordered={true} />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 10 }}
              labelAlign="right"
              label="第三方系统编码"
              name="client_id"
              rules={[{ required: true, message: '请输入你的系统编码' }]}
            >
              <Input bordered={true} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 10 }}
              labelAlign="right"
              label="单点登录入口地址"
              name="sso_url"
              rules={[{ required: true, message: '请输入你的入口地址' }]}
            >
              <Input bordered={true} />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 10 }}
              labelAlign="right"
              label="密钥"
              name="security"
              rules={[{ required: true, message: '请输入你的秘钥' }]}
            >
              <Input bordered={true} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 10 }}
              labelAlign="right"
              label="redirect URI"
              name="redirect_uri"
              rules={[{ required: true, message: '请输入你的redirectUrl' }]}
            >
              <Input bordered={true} />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 10 }}
              labelAlign="right"
              label="多语语种:"
              name="lang_code"
              rules={[{ required: true, message: '请输入多语语种' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 10 }}
              labelAlign="right"
              label="账套编码:"
              name="busi_center_code"
              rules={[{ required: true, message: '请输入账套编码' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 10 }}
              labelAlign="right"
              label="用户属性:"
              name="user_code_mapping_attr"
              rules={[{ required: true, message: '请输入用户属性' }]}
            >
              <Select placeholder="请输入属性" allowClear>
                <Option value="sub">用户ID</Option>
                <Option value="username">用户名</Option>
                <Option value="user_job_number">工号</Option>
                <Option value="phone_number">手机号</Option>
                <Option value="email">邮箱</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* <Row>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              labelAlign="right"
              label="本地登陆方式:"
              name="local_auth_method"
            >
              <Checkbox.Group
                onChange={handleLocalFunc}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'start',
                  alignItems: 'center',
                  marginLeft: '8px',
                }}
              >
                <Checkbox
                  value={JSON.stringify({
                    auth_type: 'PWD',
                    auth_id: -1,
                    name: 'IAM 用户名密码',
                  })}
                  style={{ width: '190px', marginLeft: 'unset' }}
                >
                  IAM 用户名密码
                </Checkbox>
                <Checkbox
                  value={JSON.stringify({
                    auth_type: 'SMS',
                    auth_id: -1,
                    name: '短信验证码',
                  })}
                  style={{ width: '190px', marginLeft: 'unset' }}
                >
                  短信验证码
                </Checkbox>
                <Checkbox
                  value={JSON.stringify({
                    auth_type: 'EMAIL',
                    auth_id: -1,
                    name: '邮箱验证码',
                  })}
                  style={{ width: '190px', marginLeft: 'unset' }}
                >
                  邮箱验证码
                </Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              labelAlign="right"
              label="用户编码属性:"
              name="user_code_mapping_attr"
              rules={[{ required: true, message: '请输入用户编码属性' }]}
            >
              <Select placeholder="请输入属性" value={changeValue} onChange={onChange} allowClear>
                <Option value="sub">用户ID</Option>
                <Option value="username">用户名</Option>
                <Option value="user_job_number">工号</Option>
                <Option value="phone_number">手机号</Option>
                <Option value="email">邮箱</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row wrap>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              labelAlign="right"
              label="企业认证登录:"
              name="third_auth_methods"
            >
              <Checkbox.Group
                onChange={handleqiyeFunc}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'start',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginLeft: '8px',
                }}
              >
                {localSign.map((element: any, index: number) => {
                  return (
                    <Checkbox
                      value={JSON.stringify(element)}
                      style={{ width: '190px', marginBottom: '20px', marginLeft: 'unset' }}
                      key={index}
                    >
                      {element.name}
                    </Checkbox>
                  );
                })}
              </Checkbox.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 7 }}
              labelAlign="right"
              label="多因子认证:"
              name="mfa"
            >
              <Checkbox.Group>
                <Checkbox value="SMS">短信验证码</Checkbox>
                <Checkbox value="EMAIL">邮箱验证码</Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </Col>
        </Row>

        <Row wrap>
          <Col span={12}>
            {arr_ls(firstA.concat(firstB, totalArr)).length ? (
              <Form.Item
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                labelAlign="right"
                label="默认登录方式:"
                name="default_auth"
              >
                <Radio.Group
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    marginTop: '5px',
                    marginLeft: '8px',
                  }}
                >
                  {arr_ls(firstA.concat(firstB, totalArr)).map((mapIs: any, mapIx: number) => (
                    <Radio
                      value={JSON.stringify({
                        auth_type: JSON.parse(mapIs).auth_type,
                        auth_id: `${JSON.parse(mapIs).auth_id}`,
                        name: JSON.parse(mapIs).name,
                      })}
                      // value={'{"auth_type":"WEWORK","auth_id":"1544207165644935169","name":"11"}'}
                      style={{ marginBottom: '20px', marginLeft: 'unset', width: '190px' }}
                      key={mapIx}
                    >
                      {JSON.parse(mapIs).name}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            ) : (
              ''
            )}
          </Col>
        </Row> */}
      </Form>
    </Spin>
  );
});
