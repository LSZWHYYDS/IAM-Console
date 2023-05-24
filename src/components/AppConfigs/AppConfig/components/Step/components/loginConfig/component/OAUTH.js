import React, { Component } from 'react';
import { Button, Checkbox, Col, Collapse, InputNumber, Radio, Row, Select, Typography } from 'antd';
import FormItem from 'antd/es/form/FormItem';
const Panel = Collapse.Panel;
import appUtil from '../../authorScope/component/components/appUtil';
import DynamicFieldSet from '@/components/DynamicFieldSet';

import MsgTip from '@/components/MsgTip';

const { Text } = Typography;
const RadioGroup = Radio.Group,
  Option = Select.Option;

const formItemLayout = {
  labelCol: {
    xs: { span: 17 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 6 },
    sm: { span: 5 },
  },
};
export default class OAUTH extends Component {
  constructor(...args) {
    super(...args);
    const { login_policy = {} } = this.props.appDetail || {};
    const filedsInitial = login_policy.mfa || [];
    this.state = {
      filedsInitial,
      selected: [],
      optionList: [],
      policyInfo: {},
      isLocalAuth: '',
      application_type: this.props.appDetail.application_type,
      policyKeys: [...filedsInitial.keys()],
      value: 'OIDC',

      verify_one: [],
      verify_twos: [],
      verify_three: [],
      mfa: [],
      default_lsArray: [],
      default_Obj: {},
      default_lsOne: [],

      redirect_uris: [],
      authorArr: [],

      // access 有效期
      access_token_timeout: 0,
      id_token_timeout: 0,
      refresh_token_timeout: 0,
      authorArr_oauth: [],

      // 复选框Group数组
      localTheEcheo: [],
      default_arr: [],
      grant_type: [],
      auth_arr: [],

      temp_lin_auth: [],
      defalut_ls: null,

      // 重构默认选项
      localhost_array: [],
      auth_arr_ls: [],
      newAuth_loc: [],

      obj: {
        email_enabled: false,
        pwd_enabled: false,
        sms_enabled: false,
      },
      showCustomize: true,

      loading: true,
    };
  }

  modifyFatherPar_oauth(val) {
    this.setState({
      authorArr_oauth: val,
    });
  }
  changeTimeoutType(e) {
    this.setState({
      showCustomize: e.target.value === 'customize',
    });
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const nextDataArr = nextProps.appDetail?.config?.grant_type;
    if (nextDataArr?.length !== this.props?.appDetail?.config?.grant_type.length) {
      this.setState({
        authorArr_oauth: nextProps.appDetail?.config?.grant_type,
      });
    }
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        showCustomize:
          this.props?.appDetail?.config?.refresh_token_timeout_type == 'neverExpired'
            ? false
            : true,
      });
      this.props?.setOauthFormField('OAUTH');
    }, 100);
  }

  renderOauth() {
    const { application_type = 'NATIVE' } = this.state;
    let redirect_uris;
    if (this.props?.appDetail?.config) {
      redirect_uris = this.props?.appDetail?.config?.redirect_uris;
    }
    const map = {
      NATIVE: 'scheme为应用自定义或http，当为http时hostname必须是localhost。',
      SPA: 'scheme可以是https或http，推荐使用更安全的https协议。且hostname不能是localhost。',
      WEB: 'scheme可以是https或http，推荐使用更安全的https协议。',
    };

    const { access_token_timeout, refresh_token_timeout, id_token_timeout } = this.props.appDetail;
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 6 },
        sm: { span: 5 },
      },
    };

    return (
      <Collapse
        defaultActiveKey={['appType', 'ssoSetting', 'apptoken', 'appcert', 'ssoSetting', 'point']}
        bordered={false}
        style={{ backgroundColor: '#FFF' }}
      >
        <Panel header="认证设置" key="ssoSetting">
          <FormItem name={'grantType'} initialValue={this.state.authorArr_oauth}>
            <Checkbox.Group
              onChange={this.modifyFatherPar_oauth.bind(this)}
              defaultValue={this.state.authorArr_oauth}
            >
              <Row wrap={false} style={{ marginBottom: '30px', marginTop: '30px' }}>
                <Col span={3} offset={1} style={{ textAlign: 'right' }}>
                  <span>授权模式：</span>
                </Col>
                <Col offset={2}>
                  <Checkbox value={'authorization_code'}>authorization_code</Checkbox>
                </Col>
                <Col offset={2}>
                  <Checkbox value={'implicit'}>implicit</Checkbox>
                </Col>
                <Col offset={3}>
                  <Checkbox value={'password'}>password</Checkbox>
                </Col>
                <Col offset={3}>
                  <Checkbox value={'client_credentials'}>client_credentials</Checkbox>
                </Col>
                <Col offset={3} span={8}>
                  <Checkbox
                    value={'refresh_token'}
                    disabled={
                      this.state.grant_type.length == 0 && this.state.authorArr_oauth.length == 0
                        ? true
                        : false
                    }
                  >
                    <Text underline>refresh_token</Text>
                  </Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </FormItem>
        </Panel>

        <Panel header="端点信息" key="point">
          {appUtil.hasRedirectURI(application_type) && (
            <DynamicFieldSet
              clientID_ls={this.props.client_id}
              formRef={this.formRef}
              appType={application_type}
              dataArr={redirect_uris || []}
              label={
                <span title="RedirectURIs">
                  {'RedirectURIs'}
                  <MsgTip msg={map[application_type]} />
                </span>
              }
              labelSpan={4}
              wrapperSpan={12}
            />
          )}
        </Panel>
        <Panel header="Token 有效期" key="apptoken">
          <FormItem
            {...formItemLayout1}
            label="Access Token 有效期"
            name="access_token_timeout"
            initialValue={access_token_timeout ? access_token_timeout / 60 : ''}
            rules={[
              {
                required: true,
                message: '请输入Access Token 有效期',
                type: 'number',
                min: 1,
              },
            ]}
          >
            <InputNumber addonAfter="分钟" />
          </FormItem>
          {appUtil.canOfflineAccess(application_type) && (
            <FormItem
              {...formItemLayout}
              label="Refresh Token 有效期"
              name="refresh_token_timeout_type"
              initialValue={refresh_token_timeout === 0 ? 'neverExpired' : 'customize'}
            >
              <RadioGroup onChange={this.changeTimeoutType.bind(this)}>
                <Radio value="customize">自定义</Radio>
                <Radio value="neverExpired">永不过期</Radio>
              </RadioGroup>
            </FormItem>
          )}
          {this.state.showCustomize && (
            <FormItem
              label="时间"
              {...formItemLayout1}
              name="refresh_token_timeout"
              initialValue={refresh_token_timeout / 3600 || '0'}
              rules={[{ required: true, message: '请输入时间', type: 'number', min: 0, max: 720 }]}
            >
              <InputNumber addonAfter="小时" />
            </FormItem>
          )}
        </Panel>
      </Collapse>
    );
  }

  render() {
    return this.renderOauth();
  }
}
