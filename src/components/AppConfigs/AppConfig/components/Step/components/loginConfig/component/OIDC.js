import React, { Component } from 'react';
import { Button, Checkbox, Col, Collapse, InputNumber, Radio, Row, Select, Typography } from 'antd';
import appUtil from '../../authorScope/component/components/appUtil';
import DynamicFieldSetOIDC from '@/components/DynamicFieldSet/indexOIDC';
import MsgTip from '@/components/MsgTip';
import FormItem from 'antd/es/form/FormItem';
import InfoItem from '@/components/InfoItem';
import SignatureSecret from '../../authorScope/component/components/SignatureSecret';
import AppInfoProfile from '../../authorScope/component/components/AppInfo/AppInfoProfile';
import conf from '@/utils/conf';

const Panel = Collapse.Panel;
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

export default class OIDC extends Component {
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

      loading: true,

      signatureAlg: 'RS256',
      showCustomize: true,
    };
    // this.formRef = React.createRef(null);
  }

  handleChange(value) {
    this.setState({ signatureAlg: value });
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps?.appDetail?.config?.grant_type?.length != this.state?.grant_type?.length) {
      this.setState({
        grant_type: nextProps?.appDetail?.config?.grant_type || [],
        auth_arr: nextProps?.appDetail?.config?.grant_type || [],
        authorArr_oauth: nextProps?.appDetail?.config?.grant_type || [],
        // signatureAlg: nextProps?.appDetail?.config?.signing_alg,
      });
    }
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.props?.appDetail?.config?.refresh_token_timeout_type == 'customize') {
        this.setState({
          signatureAlg: this.props?.appDetail?.config?.signing_alg || 'RS256',
        });
      }
      this.setState({
        showCustomize:
          this.props?.appDetail?.config?.refresh_token_timeout_type == 'neverExpired'
            ? false
            : true,
      });
      this.props?.setOauthFormField('OIDC');
    }, 100);
  }

  getOIDCTableData() {
    return this.appInfoProfileRef?.onGetSaveValue?.();
  }

  renderToken() {
    const {
      application_type = 'NATIVE',
      access_token_timeout,
      refresh_token_timeout,
      id_token_timeout,
    } = this.props.appDetail;
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
      <Panel header="Token 有效期" key="apptoken">
        <FormItem
          {...formItemLayout1}
          label="Access Token 有效期"
          name="access_token_timeout"
          // initialValue={access_token_timeout ? (access_token_timeout / 60) : ''}
          rules={[
            {
              required: true,
              message: '请输入Access Token 有效期',
              type: 'number',
            },
          ]}
        >
          <InputNumber addonAfter="分钟" min={1} />
        </FormItem>
        {appUtil.canOfflineAccess(application_type) && (
          <FormItem
            {...formItemLayout1}
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
            rules={[{ required: true, message: '请输入时间', type: 'number' }]}
          >
            <InputNumber addonAfter="小时" min={1} />
          </FormItem>
        )}
        <Row>
          {appUtil.hasIdToken(application_type) && (
            <Col span={24}>
              <FormItem
                label="ID Token 有效期"
                {...formItemLayout1}
                name="id_token_timeout"
                initialValue={id_token_timeout ? id_token_timeout / 60 : ''}
                rules={[
                  {
                    required: true,
                    message: '请输入ID Token 有效期',
                    type: 'number',
                  },
                ]}
              >
                <InputNumber addonAfter="分钟" min={1} />
              </FormItem>
            </Col>
          )}
        </Row>
      </Panel>
    );
  }

  renderIdToken() {
    const { client_id } = this.props;
    const { signing_alg = 'RS256', signature_secret } = this.props.appDetail;
    return (
      <Panel header="ID Token 签名设置" key="appcert">
        <FormItem label="签名方式" {...formItemLayout} name="signing_alg" initialValue={'RS256'}>
          <Select
            allowClear={true}
            placeholder="签名方式"
            style={{ width: '300px' }}
            onChange={this.handleChange.bind(this)}
          >
            <Option key="RS256" value="RS256">
              非对称秘钥签名
            </Option>
            <Option key="HS256" value="HS256">
              对称秘钥签名
            </Option>
          </Select>
        </FormItem>
        {this.state.signatureAlg == 'RS256' && (
          <InfoItem
            titleSpan={5}
            contentSpan={3}
            titleStr="非对称签名证书"
            isNormal={true}
            contentObj={
              <Button type="primary" onClick={this.downloadCert.bind(this)}>
                点击下载
              </Button>
            }
          />
        )}
        {this.state.signatureAlg == 'HS256' && (
          <SignatureSecret
            signature_secret={signature_secret}
            clientID={client_id}
            isEdit={true}
            mergeAppDetail={this.props.mergeAppDetail}
          />
        )}
        {Object.prototype.toString.call(this.props.appDetail) !== '[object Array]' ? (
          <AppInfoProfile
            ref={(ref) => {
              this.appInfoProfileRef = ref;
            }}
            appDetail={this.props.appDetail}
          />
        ) : (
          ''
        )}
      </Panel>
    );
  }
  changeTimeoutType(e) {
    this.setState({
      showCustomize: e.target.value === 'customize',
    });
  }
  downloadCert() {
    window.open(
      `${conf.getServiceUrl()}/apps/${
        this.props.client_id
      }/download_cert?tcode=${sessionStorage.getItem('tcode')}`,
    );
  }
  // 子组件向父组件传递参数
  modifyFatherPar(val) {
    this.setState({
      grant_type: val,
      auth_arr: val,
      authorArr_oauth: val,
    });
  }
  renderOIDC() {
    let redirect_uris = [];
    if (this.props.appDetail?.config) {
      redirect_uris = this.props.appDetail?.config?.redirect_uris;
    }
    const { application_type = 'NATIVE' } = this.state;
    const options = [
      { label: '用户名密码', value: 'PWD', disabled: true },
      { label: '短信', value: 'SMS' },
      { label: '邮件', value: 'EMAIL' },
    ];
    if (redirect_uris?.length === 0) {
      redirect_uris = this.state.redirect_uris || []; //todo
    }
    let { isLocalAuth, auth_protocol } = this.state;

    // if (!auth_protocol) {
    //    auth_protocol = this.props.appDetail.auth_protocol;
    // }
    // if (auth_protocol === 'SAML' || auth_protocol == 'OAUTH' || auth_protocol == 'CAS') {
    //    return;
    // }
    // auth_protocol = 'OIDC';
    const { login_policy = {} } = this.props.appDetail;
    const { primary_auth_method = {} } = login_policy;
    const primary_auth_methodList = [];
    if (primary_auth_method.pwd_enabled) {
      primary_auth_methodList.push('PWD');
    }
    if (primary_auth_method.email_enabled) {
      primary_auth_methodList.push('EMAIL');
    }
    if (primary_auth_method.sms_enabled) {
      primary_auth_methodList.push('SMS');
    }
    if (!primary_auth_methodList.length) {
      primary_auth_methodList.push('PWD');
    }
    if (!auth_protocol) {
      auth_protocol = this.props.appDetail.auth_protocol;
    }
    if (!isLocalAuth) {
      isLocalAuth = login_policy.auth_by;
    }
    const { appDetail = {} } = this.props;
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    const map = {
      NATIVE: 'scheme为应用自定义或http，当为http时hostname必须是localhost。',
      SPA: 'scheme可以是https或http，推荐使用更安全的https协议。且hostname不能是localhost。',
      WEB: 'scheme可以是https或http，推荐使用更安全的https协议。',
    };

    return (
      <Collapse
        defaultActiveKey={['appType', 'ssoSetting', 'apptoken', 'appcert', 'point', 'setting']}
        bordered={false}
        style={{ backgroundColor: '#FFF' }}
      >
        <Panel header="认证设置" key="setting">
          <Row>
            <Col span={3} offset={1} style={{ textAlign: 'right' }}>
              <span style={{ verticalAlign: 'sub' }}>授权模式：</span>
            </Col>
            <Col span={20}>
              {/* todo oidcGrantType 临时设置回显 没有真实意义 */}
              <FormItem name={'oidcGrantType'}>
                <Checkbox.Group
                  onChange={this.modifyFatherPar.bind(this)}
                  defaultValue={this.state.grant_type}
                >
                  <Row wrap={false}>
                    <Col span={4}>
                      <Checkbox value={'authorization_code'}>authorization_code</Checkbox>
                    </Col>
                    <Col offset={3}>
                      <Checkbox value={'implicit'}>implicit</Checkbox>
                    </Col>
                    <Col offset={3}>
                      <Checkbox value={'password'}>password</Checkbox>
                    </Col>
                    <Col offset={4}>
                      <Checkbox value={'client_credentials'}>client_credentials</Checkbox>
                    </Col>
                    <Col offset={3} span={8}>
                      <Checkbox
                        value={'refresh_token'}
                        disabled={
                          this.state.grant_type.length == 0 &&
                          this.state.authorArr_oauth.length == 0
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
            </Col>
          </Row>
        </Panel>

        <Panel header="端点信息" key="point">
          {appUtil.hasRedirectURI(application_type) && (
            <DynamicFieldSetOIDC
              clientID_ls={this.props.client_id}
              formRef={this.formRef}
              appType={application_type}
              dataArr={redirect_uris || []}
              label={
                <span title="RedirectURIs">
                  {'RedirectURIs：'}
                  <MsgTip msg={map[application_type]} />
                </span>
              }
              labelSpan={4}
              wrapperSpan={12}
            />
          )}
        </Panel>
        {this.renderToken()}
        {this.renderIdToken()}
      </Collapse>
    );
  }
  render() {
    return this.renderOIDC();
  }
}
