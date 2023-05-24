import React, { Component } from 'react';
import DynamicFieldSetOIDC from '@/components/DynamicFieldSet/indexOIDC';
import AppInfoSSOLoginSamlOAuth from '../../authorScope/component/components/AppInfo/AppInfoSSOLoginSamlOAuth';
import DynamicFieldSetCas from '@/components/DynamicFieldSet/indexCas';
import MsgTip from '@/components/MsgTip';
import appUtil from '../../authorScope/component/components/appUtil';

import { Button, Checkbox, Col, Collapse, InputNumber, Radio, Row, Select, Typography } from 'antd';
const Panel = Collapse.Panel;
const { Text } = Typography;
const RadioGroup = Radio.Group,
  Option = Select.Option;

export default class CAS extends Component {
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
    };
  }
  renderCas() {
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
    let { auth_protocol } = this.state;
    return (
      <>
        <Collapse
          defaultActiveKey={['appType', 'ssoSetting', 'apptoken', 'appcert']}
          bordered={false}
          style={{ backgroundColor: '#FFF' }}
        >
          <Panel header="端点信息" key="ssoSetting">
            {appUtil.hasRedirectURI(application_type) && (
              <DynamicFieldSetCas
                clientID_ls={this.props.client_id}
                formRef={this.formRef}
                appType={application_type}
                dataArr={redirect_uris || []}
                label={
                  <span title="Service URL">
                    {'Service URL'}
                    <MsgTip msg={map[application_type]} />
                  </span>
                }
                labelSpan={4}
                wrapperSpan={12}
              />
            )}
          </Panel>
          <AppInfoSSOLoginSamlOAuth
            form={this.formRef}
            appDetail={this.props.appDetail}
            ref={(ref) => {
              this.AppInfoSSOLoginSamlRefss = ref;
            }}
          />
        </Collapse>
      </>
    );
  }
  render() {
    return this.renderCas();
  }
}
