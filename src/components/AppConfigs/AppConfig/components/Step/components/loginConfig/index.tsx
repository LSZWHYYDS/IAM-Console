import { Button, Checkbox, Col, Form, Radio, Row } from 'antd';
import { connect } from 'umi';
import Dynamic from './dynamicRender';
import Controls from './controls';
import { useLocation } from 'umi';
import OIDC from './component/OIDC';
import SAML from './component/SAML';
import CAS from './component/CAS';
import OAUTH from './component/OAUTH';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { DoubleLeftOutlined, SaveOutlined } from '@ant-design/icons';

const mapStateToProps = (state) => {
  return {
    siblingRef$: state.component_configs.siblingRef$,
  };
};
const LoginConfig = (props, ref) => {
  const [form] = Form.useForm();
  const TableRefs = useRef(null);

  const location: any = useLocation();
  const userAgreement = Form.useWatch('auth_protocol', form);
  const handleStepsChange = props.handleStepsChange;
  const { state, formValuesChange, formSubmit, mergeAppDetail } = Controls({
    form,
    dispatch: props.dispatch,
    handleStepsChange,
  });
  const { certificationEnterprise, defaultArray = [], saveTemplateConfig, appInfo } = state;
  /**
   * @description 获取全局store事件线 进行监听 提交表单事件
   */
  props.siblingRef$.useSubscription(({ loginConfigSubmmit, currentFlag }) => {
    const grant_type = TableRefs?.current?.state?.authorArr_oauth;

    if (currentFlag != null || currentFlag != undefined) {
      // 为了添加不同协议展示不同配置界面 新增逻辑判断
      if (userAgreement == 'OAUTH') {
        if (loginConfigSubmmit) formSubmit(props.siblingRef$, currentFlag, grant_type);
      } else if (userAgreement == 'OIDC') {
        const getOIDCTableData = TableRefs?.current?.getOIDCTableData?.();
        if (loginConfigSubmmit)
          formSubmit(props.siblingRef$, currentFlag, {
            OIDCData: getOIDCTableData,
            grant_type: grant_type,
          });
      } else if (userAgreement == 'SAML') {
        const getSAMLTableData = TableRefs?.current?.getSAMLData();
        if (loginConfigSubmmit)
          formSubmit(props.siblingRef$, currentFlag, {
            OIDCData: getSAMLTableData,
            grant_type: grant_type,
          });
      } else {
        if (loginConfigSubmmit) formSubmit(props.siblingRef$, currentFlag);
      }
    } else {
      if (userAgreement == 'OAUTH') {
        // params 为了占位（无真实作用）
        if (loginConfigSubmmit) formSubmit(props.siblingRef$, 'params', grant_type);
      } else if (userAgreement == 'OIDC') {
        const getOIDCTableDatas = TableRefs?.current?.getOIDCTableData?.();
        if (loginConfigSubmmit)
          formSubmit(props.siblingRef$, 'params', {
            OIDCData: getOIDCTableDatas,
            grant_type: grant_type,
          });
      } else if (userAgreement == 'SAML') {
        const getSAMLTableDatas = TableRefs?.current?.getSAMLData();
        if (loginConfigSubmmit)
          formSubmit(props.siblingRef$, 'params', {
            OIDCData: getSAMLTableDatas,
            grant_type: grant_type,
          });
      } else {
        if (loginConfigSubmmit) formSubmit(props.siblingRef$);
      }
    }
  });

  const setOauthorOIDCFormField = (type) => {
    if (type == 'OIDC') {
      form.setFieldsValue({
        oidcGrantType: appInfo?.config?.grant_type,
      });
    } else {
      form.setFieldsValue({
        grantType: appInfo?.config?.grant_type,
      });
    }
  };
  const authorArrOauthList = () => {
    if (Object.prototype.toString.call(appInfo) == '[object Array]') return;

    if (userAgreement == 'OIDC') {
      return (
        <OIDC
          appDetail={appInfo}
          client_id={location.query.client_id || sessionStorage.getItem('appClientId')}
          mergeAppDetail={mergeAppDetail}
          setOauthFormField={setOauthorOIDCFormField}
          ref={TableRefs}
        />
      );
    }

    if (userAgreement == 'SAML') {
      return (
        <SAML
          appDetail={appInfo}
          client_id={location.query.client_id || sessionStorage.getItem('appClientId')}
          mergeAppDetail={mergeAppDetail}
          ref={TableRefs}
        />
      );
    }

    if (userAgreement == 'OAUTH') {
      return (
        <OAUTH
          appDetail={appInfo}
          client_id={location.query.client_id || sessionStorage.getItem('appClientId')}
          mergeAppDetail={mergeAppDetail}
          setOauthFormField={setOauthorOIDCFormField}
          ref={TableRefs}
        />
      );
    }

    if (userAgreement == 'CAS') {
      return (
        <CAS
          appDetail={appInfo}
          client_id={location.query.client_id || sessionStorage.getItem('appClientId')}
          mergeAppDetail={mergeAppDetail}
          ref={TableRefs}
        />
      );
    }
    if (userAgreement == 'APPSTORE') {
      return <Dynamic arr={[saveTemplateConfig]} address={appInfo?.client_uri || ''} />;
    }
    return <></>;
  };

  useEffect(() => {
    if (appInfo?.config?.auth_protocol == 'OIDC') {
      form.setFieldsValue({
        oidcGrantType: appInfo?.config?.grant_type,
      });
    } else if (appInfo?.config?.auth_protocol == 'SAML') {
    } else if (appInfo?.config?.auth_protocol == 'OAUTH') {
      form.setFieldsValue({
        grantType: appInfo?.config?.grant_type,
      });
    } else if (appInfo?.config?.auth_protocol == 'CAS') {
    } else {
    }
  }, [appInfo]);

  useEffect(() => {
    form.setFieldsValue({
      auth_protocol: appInfo?.config?.auth_protocol || 'OIDC',
    });
  }, []);
  useImperativeHandle(ref, () => ({
    formSubmit,
  }));

  return (
    <div>
      <Form name="basic" labelWrap autoComplete="off" form={form} onValuesChange={formValuesChange}>
        <Row>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 20 }}
              labelAlign="right"
              label="本地登陆方式"
              name="local_auth_method"
            >
              <Checkbox.Group
                style={{
                  width: '100%',
                  marginLeft: '8px',
                }}
              >
                <Checkbox
                  value={JSON.stringify({
                    auth_type: 'PWD',
                    auth_id: '-1',
                    name: 'IAM 用户名密码',
                  })}
                  style={{ width: '30%', marginLeft: 'unset' }}
                >
                  IAM 用户名密码
                </Checkbox>
                <Checkbox
                  value={JSON.stringify({
                    auth_type: 'SMS',
                    auth_id: '-1',
                    name: '短信验证码',
                  })}
                  style={{ width: '30%', marginLeft: 'unset' }}
                >
                  短信验证码
                </Checkbox>
                <Checkbox
                  value={JSON.stringify({
                    auth_type: 'EMAIL',
                    auth_id: '-1',
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
              label="企业认证登录"
              name="third_auth_methods"
            >
              <Checkbox.Group
                style={{
                  width: '100%',
                  marginLeft: '8px',
                }}
              >
                {certificationEnterprise.map((element: any, index: number) => {
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
              label="多因子认证"
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
            <Form.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 20 }}
              labelAlign="right"
              label="默认登录方式"
              name="default_auth"
              hidden={defaultArray?.length == 0 ? true : false}
            >
              <Radio.Group
                style={{
                  width: '100%',
                  marginTop: '5px',
                  marginLeft: '8px',
                }}
              >
                {defaultArray?.map((mapIs: any, mapIx: number) => (
                  <Radio
                    value={JSON.stringify(mapIs)}
                    style={{
                      width: '30%',
                      marginBottom: '20px',
                      marginLeft: 'unset',
                    }}
                    key={mapIx}
                  >
                    {mapIs?.name}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 20 }}
              labelAlign="right"
              label="集成协议"
              name="auth_protocol"
            >
              <Radio.Group>
                {appInfo?.support_protocol?.map?.((mapIS) => {
                  const labelMapping = {
                    OIDC: 'OIDC协议',
                    SAML: 'SAML协议',
                    OAUTH: 'Oauth2.0协议',
                    CAS: 'CAS协议',
                    APPSTORE: '非标协议',
                  };
                  return <Radio.Button value={mapIS}>{labelMapping[mapIS]}</Radio.Button>;
                })}
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <div style={{ marginLeft: -18 }}>{authorArrOauthList()}</div>
      </Form>
      <Row justify={'center'}>
        <Col>
          <Button
            type="primary"
            icon={<DoubleLeftOutlined />}
            onClick={() => handleStepsChange(0)}
            style={{ margin: '30px 0' }}
          >
            上一步
          </Button>
        </Col>
        <Col span={4}></Col>
        <Col>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={() => {
              props?.siblingRef$.emit({
                loginConfigSubmmit: true,
              });
            }}
            style={{ margin: '30px 0' }}
          >
            保存并下一步
          </Button>
        </Col>
      </Row>
    </div>
  );
};
export default connect(mapStateToProps, null, null, { forwardRef: true })(forwardRef(LoginConfig));
