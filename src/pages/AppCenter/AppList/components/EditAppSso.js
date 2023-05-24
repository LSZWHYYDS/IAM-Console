import DynamicFieldSet from '@/components/DynamicFieldSet';
import DynamicFieldSetCas from '@/components/DynamicFieldSet/indexCas';
import DynamicFieldSetOIDC from '@/components/DynamicFieldSet/indexOIDC';
import InfoItem from '@/components/InfoItem';
import MsgTip from '@/components/MsgTip';
import {
  errorCode,
  filterDangerousChars,
  showErrorMessage,
  showSuccessMessage,
} from '@/utils/common.utils';
import conf from '@/utils/conf';
import { MinusOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  Divider,
  Form,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Tooltip,
  Typography,
  Spin,
  message,
} from 'antd';
import React, { Component } from 'react';
import { authFactorList, requestEnterpriseLogin, updateSSOInfo } from '../service';
import AppInfoProfile from './AppInfo/AppInfoProfile';
import AppInfoSSOLoginSaml from './AppInfo/AppInfoSSOLoginSaml';
import AppInfoSSOLoginSamlOAuth from './AppInfo/AppInfoSSOLoginSamlOAuth';

import appUtil from './appUtil';
import SignatureSecret from './SignatureSecret';
const { Text, Link } = Typography;
const Panel = Collapse.Panel;
const RadioGroup = Radio.Group,
  Option = Select.Option,
  FormItem = Form.Item,
  CheckboxGroup = Checkbox.Group;
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
class EditAppSso extends Component {
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
    this.idAuth = filedsInitial ? filedsInitial.length : 0;

    this.formRefs = React.createRef(null);
  }
  fetchFormRefObj() {
    return this.formRefs.current?.validateFields().then((value) => {
      for (const item in value) {
        if (!value[item]) {
          value[item] = '';
        }
      }
      return {
        ...value,
        assertion_attributes: this.AppInfoSSOLoginSamlRef.onGetSaveValue(),
      };
    });
  }

  componentDidMount() {
    filterDangerousChars();
    this.getOptionList();
    requestEnterpriseLogin().then((rs) => {
      this.setState({
        verify_one: rs.data,
        loading: false,
      });
    });
    // 本地回显操作
    let TheEcho = this.props.appDetail.login_policy?.local_auth_method;
    if (TheEcho) {
      let TempObj = [
        { name: 'pwd_enabled', auth_type: 'PWD', auth_id: -1, names: 'IAM 用户名密码' },
        { name: 'sms_enabled', auth_type: 'SMS', auth_id: -1, names: '短信验证码' },
        { name: 'email_enabled', auth_type: 'EMAIL', auth_id: -1, names: '邮箱验证码' },
      ];
      for (let i in TheEcho) {
        if (TheEcho[i]) {
          for (let j = 0; j < TempObj.length; j++) {
            if (TempObj[j].name == i) {
              this.state.localTheEcheo.push(JSON.stringify(TempObj[j]));
              this.state.default_lsOne.push(JSON.stringify(TempObj[j]));
              this.state.localhost_array.push(JSON.stringify(TempObj[j]));
            }
          }
        }
      }
      this.state.localTheEcheo.forEach((is, inx) => {
        this.state.default_lsArray.push({
          auth_id: JSON.parse(is).auth_id,
          auth_type: JSON.parse(is).auth_type,
          name: JSON.parse(is).name,
          names: JSON.parse(is).names,
        });
      });
    }

    //多因子认证回显
    if (this.props.appDetail.login_policy?.mfa) {
      this.props.appDetail.login_policy.mfa.forEach((is) => {
        this.state.default_arr.push(is);
      });
    }
    // 授权模式回显
    if (this.props.appDetail?.grant_type) {
      this.props.appDetail.grant_type.forEach((is, inx) => {
        this.state.grant_type.push(is);
        this.state.authorArr_oauth.push(is);
      });
    }
    // OUTHER2.0的授权模式回显
    // .......
    // 企业认证回显
    if (this.props.appDetail.login_policy?.third_auth_methods) {
      this.props.appDetail.login_policy.third_auth_methods.forEach((is, inx) => {
        this.state.auth_arr.push(JSON.stringify(is));
        this.state.newAuth_loc.push(JSON.stringify(is));
        this.state.default_lsOne.push(JSON.stringify(is));
        this.state.auth_arr_ls.push(JSON.stringify(is));
      });
    }

    // 默认登录
    if (this.props.appDetail.login_policy?.default_auth) {
      // this.state.default_Obj = this.props.appDetail.login_policy?.default_auth;
      this.setState((state, props) => {
        return {
          default_Obj: props.appDetail.login_policy?.default_auth,
        };
      });
      let a_obj = this.props.appDetail.login_policy?.default_auth;
      if (a_obj.name == 'pwd_enabled') {
        a_obj.names = 'IAM 用户名密码';
      } else if (a_obj.name == 'sms_enabled') {
        a_obj.names = '短信验证码';
      } else if (a_obj.name == 'email_enabled') {
        a_obj.names = '邮箱验证码';
      }
      this.setState((state, props) => {
        return {
          defalut_ls: JSON.stringify(a_obj),
        };
      });
      // this.state.defalut_ls = JSON.stringify(a_obj)
    }
  }
  authI18n(text) {
    const map = {
      EMAIL: '邮件',
      SMS: '短信',
      CERT: '软证书',
    };
    return map[text];
  }
  getOptionList() {
    authFactorList().then((res) => {
      if (res.error === '0') {
        const authFactors = res.data,
          optionList = [];
        authFactors.forEach((item) => {
          if (item.auth_method !== 'PWD') {
            optionList.push(item.auth_method);
          }
        });
        this.setState({
          optionList,
        });
      }
    });
  }
  componentWillUnmount() {}
  getRadioItem({ key, label, tip }) {
    return (
      <Radio value={key}>
        <Tooltip placement="topLeft" title={tip} arrowPointAtCenter>
          {label}
        </Tooltip>
      </Radio>
    );
  }
  selectChange(index, value) {
    let selected = this.state.selected;
    if (!selected.includes(value)) {
      selected[index] = value;
      this.setState({
        selected,
      });
    } else {
      this.formRef.current.setFieldsValue({
        [`mfa[${index}]`]: '',
      });
    }
  }
  selectMainPolicy(value) {
    if (value === 'LOCAL') {
      let policyInfo = this.state.policyInfo;
      policyInfo.primary_auth_method = [];
      policyInfo.primary_auth_method.push('PWD');
      this.setState({
        policyInfo,
      });
    }
    this.setState({
      isLocalAuth: value,
    });
  }
  getPolicy2() {
    const { login_policy = {} } = this.props.appDetail;
    let { filedsInitial, optionList, policyKeys } = this.state;
    if (filedsInitial.length === 1 && filedsInitial[0] === '') {
      filedsInitial = login_policy.mfa || [''];
    }
    if (optionList.length === 0) {
      return null;
    }
    const formItemLayoutP = {
      labelCol: {
        xs: { span: 10 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 6 },
        sm: { span: 5 },
      },
    };
    const formItems = policyKeys.map((k, index) => (
      <FormItem key={'p' + k}>
        <Row>
          <Col span={16}>
            <FormItem
              {...formItemLayoutP}
              label={`${index + 2}级认证`}
              // labelCol={15}
              key={k}
              name={`mfa[${k}]`}
              initialValue={filedsInitial[k]}
              rules={[{ required: true }]}
              // style={{width: "600px"}}
              // validateTrigger: ["onChange", "onBlur"],todo
            >
              <Select
                onSelect={this.selectChange.bind(this, k)}
                allowClear={true}
                placeholder="多因子策略"
                style={{ width: '300px' }}
              >
                {optionList.map((item) => {
                  return (
                    <Option key={item} value={item}>
                      {this.authI18n(item)}
                    </Option>
                  );
                })}
              </Select>
            </FormItem>
          </Col>
          <Col style={{ width: '40px' }}>
            {policyKeys.length > 0 ? <MinusOutlined onClick={() => this.remove(k)} /> : null}
          </Col>
        </Row>
      </FormItem>
    ));
    return formItems;
  }

  add() {
    const keys = this.state.policyKeys;
    const nextKeys = keys.concat(++this.idAuth);
    this.setState({
      policyKeys: nextKeys,
    });
  }
  remove = (k) => {
    const keys = this.state.policyKeys;
    const selected = this.state.selected;
    selected.splice(k, 1);
    this.setState({
      selected,
    });
    if (keys.length === 0) {
      return;
    }
    this.setState({
      policyKeys: keys.filter((key) => key !== k),
    });
  };
  changeTimeoutType(e) {
    this.setState({
      showCustomize: e.target.value === 'customize',
    });
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
          initialValue={access_token_timeout ? access_token_timeout / 60 : ''}
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
        {(this.state.showCustomize === undefined
          ? refresh_token_timeout !== 0
          : this.state.showCustomize) && (
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
  handleChange(value) {
    this.setState({ signatureAlg: value });
  }
  downloadCert() {
    window.open(
      `${conf.getServiceUrl()}/apps/${
        this.props.client_id
      }/download_cert?tcode=${sessionStorage.getItem('tcode')}`,
    );
  }
  renderIdToken() {
    const { client_id } = this.props;
    const { signing_alg = 'RS256', signature_secret } = this.props.appDetail;
    return (
      <Panel header="ID Token 签名设置" key="appcert">
        <FormItem
          label="签名方式"
          {...formItemLayout}
          name="signing_alg"
          initialValue={signing_alg}
        >
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
        {(this.state.signatureAlg || signing_alg) == 'RS256' && (
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
        {(this.state.signatureAlg || signing_alg) == 'HS256' && (
          <SignatureSecret
            signature_secret={signature_secret}
            clientID={client_id}
            isEdit={true}
            mergeAppDetail={this.props.mergeAppDetail}
          />
        )}
        <AppInfoProfile
          ref={(ref) => {
            this.appInfoProfileRef = ref;
          }}
          appDetail={this.props.appDetail}
        />
      </Panel>
    );
  }
  onClose() {
    this.props.onClose();
  }

  // 处理合并本地登录
  integration_handle(obj) {
    let tempObj = {};
    let tempObj_One = {};
    this.state.localTheEcheo.forEach((is, inx) => {
      tempObj[Object.values(JSON.parse(is))[0]] = true;
    });
    this.state.localhost_array.forEach((is, inx) => {
      tempObj_One[Object.values(JSON.parse(is))[0]] = true;
    });
    ['email_enabled', 'pwd_enabled', 'sms_enabled'].forEach((rs) => {
      if (!tempObj_One[rs]) {
        tempObj_One[rs] = false;
      }
    });
    if (!this.state.localTheEcheo.length) {
      return { ...obj };
    } else {
      return { ...tempObj, ...tempObj_One };
    }
    // if (this.state.localTheEcheo.length) {
    //   for (const itme in this.state.obj) {
    //     if (!tempObj[itme]) {
    //       tempObj[itme] = false;
    //     }
    //   }
    //   return { ...tempObj, ...obj }
    // }
    // return { ...obj };
  }
  // 处理合并认证源登录
  intefration_handle_twos(val) {
    let val_s = [];
    val.forEach((is, inx) => {
      val_s.push(JSON.parse(is));
    });
    let twos = [];
    this.state.auth_arr.forEach((is, inx) => {
      twos.push(JSON.parse(is));
    });
    return [...val_s, ...twos];
  }

  // 过滤数组
  filter_is(digitalArr) {
    return digitalArr.reduce((preTotal, cur, index, arr) => {
      if (preTotal.includes(cur)) {
        return preTotal;
      } else {
        return preTotal.concat(cur);
      }
    }, []);
  }

  // 把数组JSON形式转对象格式
  handleJSON_object(val) {
    return val.map((mapIs, mapInx) => {
      return JSON.parse(mapIs);
    });
  }
  getLogin_policy_dtoOnSave(values) {
    const { primary_auth_method = [] } = values;
    const { mfa } = values;
    const keys = _.keys(values).filter((key) => {
      return key.includes('mfa');
    });
    const mfaVal = keys && keys.map((key) => values[key]);
    const dto = {
      // auth_by: values.auth_by,
      // mfa: mfaVal,
      // primary_auth_method: {
      //   email_enabled: primary_auth_method.includes('EMAIL'),
      //   pwd_enabled: primary_auth_method.includes('PWD'),
      //   sms_enabled: primary_auth_method.includes('SMS'),
      // },
      local_auth_method: this.integration_handle(this.state.obj),
      third_auth_methods: this.handleJSON_object(this.state.newAuth_loc),
      default_auth: this.state.default_Obj, // this.integration_defalut_obj() this.intefration_handle_twos(this.state.verify_twos)
      mfa: this.filter_is(this.state.mfa.concat(this.state.default_arr)),
    };
    return dto;
  }
  getTokenValueOnSave(values) {
    const {
      access_token_timeout,
      refresh_token_timeout_type,
      refresh_token_timeout,
      id_token_timeout,
    } = values;

    const dto = {
      access_token_timeout: parseInt(access_token_timeout, 10) * 60,
      refresh_token_timeout_type,
      refresh_token_timeout,
      id_token_timeout: id_token_timeout ? parseInt(id_token_timeout, 10) * 60 : 1800,
    };
    if (refresh_token_timeout_type === 'customize') {
      dto.refresh_token_timeout = parseInt(refresh_token_timeout, 10) * 3600;
    } else if (refresh_token_timeout_type === 'neverExpired') {
      dto.refresh_token_timeout = 0;
    }
    return dto;
  }
  getUris = (values) => {
    const uris = [];
    for (let key in values) {
      if (key.startsWith('uris-')) {
        uris.push(values[key]);
      }
    }
    return uris.filter((k) => k.length > 0);
  };
  // oauth的
  getUriss = (values) => {
    const uris = [];
    for (let key in values) {
      if (key.startsWith('uriss-')) {
        uris.push(values[key]);
      }
    }
    return uris.filter((k) => k.length > 0);
  };
  // cas的
  getUrisss = (values) => {
    const uris = [];
    for (let key in values) {
      if (key.startsWith('urisss-')) {
        uris.push(values[key]);
      }
    }
    return uris.filter((k) => k.length > 0);
  };

  fillUrisArr(obj) {
    let a = [];
    for (let i in obj) {
      a.push(obj[i]);
    }
    this.setState({
      redirect_uris: a,
    });
  }
  // 子组件向父组件传递参数
  modifyFatherPar(val) {
    this.setState({
      grant_type: val,
      auth_arr: val,
      authorArr_oauth: val,
    });
  }

  // 更改父组件中的access 变量
  modifyAccess(val) {
    this.setState({
      access_token_timeout: Number(val),
    });
  }
  modifyIdToken(val) {
    this.setState({
      id_token_timeout: Number(val),
    });
  }
  modifyTime(val) {
    this.setState({
      refresh_token_timeout: Number(val),
    });
  }

  onSubmit = (values) => {
    const varifyLoginType = this.getLogin_policy_dtoOnSave(values);
    if (
      Object?.values(varifyLoginType?.local_auth_method).every((item) => !item) &&
      varifyLoginType?.third_auth_methods?.length == 0
    ) {
      message.error('请至少勾选一种认证方式!');
      return;
    }

    const { client_id } = this.props;
    this.setState({ loading: true });

    const { application_type = 'web', auth_protocol } = values;
    let saveData = {};
    if (auth_protocol === 'OIDC') {
      // if (this.state.value === 'OIDC') {
      const tokenObj = this.getTokenValueOnSave(values);
      saveData = {
        application_type,
        auth_protocol,
        login_policy: this.getLogin_policy_dtoOnSave(values),
        whitelisted: values.whitelisted,
        ...tokenObj,
        signing_alg: values.signing_alg, //idToken
        grant_type: this.filter_is(this.state.authorArr.concat(this.state.grant_type)),
      };

      // 判断如果是OIDC则添加参数
      // if (this.state.value == 'OIDC') {
      //    saveData.redirect_uris = this.state.redirect_uris;
      //    saveData.grant_type = this.state.authorArr;
      //    saveData.access_token_timeouts = this.state.access_token_timeout;
      //    saveData.id_token_timeouts = this.state.id_token_timeout;
      //    saveData.refresh_token_timeouts = this.state.refresh_token_timeout;
      // }

      if (this.appInfoProfileRef) {
        saveData.user_profile = this.appInfoProfileRef.onGetSaveValue();
      }
      if (appUtil.hasRedirectURI(application_type)) {
        saveData.redirect_uris = this.getUris(values);
      }
    } else if (auth_protocol === 'SAML') {
      delete values.auth_protocol;
      saveData = { config: values, auth_protocol };
      saveData.login_policy = this.getLogin_policy_dtoOnSave(values);
      saveData.config.assertion_attributes = this.AppInfoSSOLoginSamlRef.onGetSaveValue();
      const objs = {
        response_signed: true,
        assertion_signed: true,
        signature_algorithm: 'RSA-SHA256',
        digest_algorithm: 'SHA256',
        name_id_format: 'none',
        autofill_setting: 'username',
      };
      // 处理values值为undefined 传递后台时异常
      let ls_Obj = {};
      for (let j in values) {
        if (values[j] != undefined) {
          ls_Obj[j] = values[j];
        }
      }
      // 处理saveData.config值为undefined传递后台时异常
      let ls_Obj_One = {};
      for (let j in saveData.config) {
        if (saveData.config[j] != undefined) {
          ls_Obj_One[j] = saveData.config[j];
        }
      }

      let objCopy = {};
      let objArray = [objs, ls_Obj_One, this.props.appDetail.config, ls_Obj];
      objArray.forEach((forIs, forIx) => {
        for (let i in forIs) {
          objCopy[i] = forIs[i];
        }
      });

      saveData.config = objCopy;
    } else if (auth_protocol === 'OAUTH') {
      if (appUtil.hasRedirectURI(application_type)) {
        saveData.redirect_uris = this.getUriss(values);
      }
      saveData.login_policy = this.getLogin_policy_dtoOnSave(values);
      saveData.grant_type = this.state.authorArr_oauth;
      saveData.access_token_timeout = values.access_token_timeout * 60;
      saveData.refresh_token_timeout = values.refresh_token_timeout * 60 * 60;
      saveData.refresh_token_timeout_type = values.refresh_token_timeout_type;
      saveData.auth_protocol = values.auth_protocol;
    } else {
      saveData.auth_protocol = values.auth_protocol;
      saveData.login_policy = this.getLogin_policy_dtoOnSave(values);

      if (appUtil.hasRedirectURI(application_type)) {
        saveData.redirect_uris = this.getUrisss(values);
      }
    }
    saveData.client_id = client_id;
    updateSSOInfo(client_id, saveData).then(
      (response) => {
        if (response) {
          this.setState({ loading: false });
          showSuccessMessage();
        }
      },
      (error) => {
        this.setState({ loading: false });
        showErrorMessage(errorCode[error.response.code] || error);
      },
    );
  };
  renderSAML() {
    let { auth_protocol } = this.state;
    if (!auth_protocol) {
      auth_protocol = this.props.appDetail.auth_protocol;
    }
    if (auth_protocol !== 'SAML') {
      return;
    }
    return (
      <AppInfoSSOLoginSaml
        form={this.formRef}
        id_client={this.props.client_id}
        appDetail={this.props.appDetail}
        fetchData={this.fetchFormRefObj.bind(this)}
        ref={(ref) => {
          this.AppInfoSSOLoginSamlRef = ref;
        }}
      />
    );
  }
  renderOIDC() {
    let { redirect_uris = [] } = this.props.appDetail;
    const { application_type = 'NATIVE' } = this.state;
    const options = [
      { label: '用户名密码', value: 'PWD', disabled: true },
      { label: '短信', value: 'SMS' },
      { label: '邮件', value: 'EMAIL' },
    ];
    if (redirect_uris.length === 0) {
      redirect_uris = this.state.redirect_uris || []; //todo
    }
    let { isLocalAuth, auth_protocol } = this.state;

    if (!auth_protocol) {
      auth_protocol = this.props.appDetail.auth_protocol;
    }
    if (auth_protocol === 'SAML' || auth_protocol == 'OAUTH' || auth_protocol == 'CAS') {
      return;
    }
    auth_protocol = 'OIDC';
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
              <span>授权模式：</span>
            </Col>
            <Col span={20}>
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
                        this.state.grant_type.length == 0 && this.state.authorArr_oauth.length == 0
                          ? true
                          : false
                      }
                    >
                      <Text underline>refresh_token</Text>
                    </Checkbox>
                    {/* <span
                      style={{ color: '#d9d9d9', display: 'inline-block', width: 'fit-content' }}
                    >
                      注解: 该选项不可单独使用
                    </span> */}
                  </Col>
                </Row>
              </Checkbox.Group>
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
  modifyFatherPar_oauth(val) {
    this.setState({
      authorArr_oauth: val,
    });
  }
  renderOauth() {
    const { application_type = 'NATIVE' } = this.state;
    let { redirect_uris = [] } = this.props.appDetail;
    const map = {
      NATIVE: 'scheme为应用自定义或http，当为http时hostname必须是localhost。',
      SPA: 'scheme可以是https或http，推荐使用更安全的https协议。且hostname不能是localhost。',
      WEB: 'scheme可以是https或http，推荐使用更安全的https协议。',
    };
    let { auth_protocol } = this.state;
    if (!auth_protocol) {
      auth_protocol = this.props.appDetail.auth_protocol;
    }
    if (auth_protocol !== 'OAUTH') {
      return;
    }

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
      <>
        <Collapse
          defaultActiveKey={['appType', 'ssoSetting', 'apptoken', 'appcert', 'ssoSetting', 'point']}
          bordered={false}
          style={{ backgroundColor: '#FFF' }}
        >
          <Panel header="认证设置" key="ssoSetting">
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
          </Panel>

          <Panel header="端点信息" key="point">
            {/* {this.getPolicy2()} */}
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
            {(this.state.showCustomize === undefined
              ? refresh_token_timeout !== 0
              : this.state.showCustomize) && (
              <FormItem
                label="时间"
                {...formItemLayout1}
                name="refresh_token_timeout"
                initialValue={refresh_token_timeout / 3600 || '0'}
                rules={[
                  { required: true, message: '请输入时间', type: 'number', min: 0, max: 720 },
                ]}
              >
                <InputNumber addonAfter="小时" />
              </FormItem>
            )}
          </Panel>
        </Collapse>
      </>
    );
  }

  renderCas() {
    const { application_type = 'NATIVE' } = this.state;
    let { redirect_uris = [] } = this.props.appDetail;
    const map = {
      NATIVE: 'scheme为应用自定义或http，当为http时hostname必须是localhost。',
      SPA: 'scheme可以是https或http，推荐使用更安全的https协议。且hostname不能是localhost。',
      WEB: 'scheme可以是https或http，推荐使用更安全的https协议。',
    };
    let { auth_protocol } = this.state;
    if (!auth_protocol) {
      auth_protocol = this.props.appDetail.auth_protocol;
    }
    if (auth_protocol !== 'CAS') {
      return;
    }
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

  onChangeProtocol(e) {
    this.setState({
      auth_protocol: e.target.value,
    });
  }

  // 渲染复选框
  renderCheckbox() {
    const resultArr = this.state.verify_one.map((item, index) => {
      return (
        <Col span={8} key={index} style={{ marginBottom: '15px', marginRight: '0px' }}>
          <Checkbox
            value={JSON.stringify({
              auth_type: item.auth_type,
              auth_id: item.auth_id,
              name: item.name,
            })}
          >
            {item.name}
          </Checkbox>
        </Col>
      );
    });
    return <>{resultArr}</>;
  }
  // 单选框事件
  // onChangeRadio(e) {
  //    this.setState({
  //       value: e.target.value,
  //    });
  // }
  onChangeRadio(e) {
    this.setState({
      auth_protocol: e.target.value,
    });
  }
  // 认证登录
  handleAuthenChange(val) {
    this.setState((state, props) => {
      return {
        // default_lsOne: this.arr_obj(state.default_lsOne.concat(val))
        default_lsOne: [...this.state.localhost_array, ...val],
        auth_arr_ls: val,
        newAuth_loc: val,
      };
    });
  }
  // 默认登录方式
  handleDefaultChange(val) {
    this.setState({
      default_Obj: JSON.parse(val.target.value),
    });
  }
  // 多因子
  handleMultifyChange(val) {
    this.setState({
      mfa: val,
      default_arr: val,
    });
  }
  // 本地登录checkbox事件
  onChangeLocalhost(val) {
    // 首先把选中的对象的name（也就pwd...）存放到数组中 然后数组中有的name obj对象name 变为true
    let val_s = [];
    val.forEach((is, inx) => {
      val_s.push(JSON.parse(is).name);
    });
    Object.keys(this.state.obj).forEach((is_s, inx_s) => {
      if (val_s.indexOf(is_s) != -1) {
        this.setState((state, poprs) => {
          return {
            obj: {
              ...state.obj,
              [is_s]: true,
            },
          };
        });
      } else {
        this.setState((state, poprs) => {
          return {
            obj: {
              ...state.obj,
              [is_s]: false,
            },
          };
        });
      }
    });
    this.setState((state, props) => {
      let a = [...state.default_lsOne, ...val];
      return {
        default_lsOne: [...val, ...this.state.auth_arr_ls],
        localhost_array: val,
      };
    });
  }

  // 动态渲染HTML
  renderHtml() {
    return this.state.default_lsOne.map((is, inx) => {
      return (
        <Col span={8} key={inx}>
          <Radio
            value={JSON.stringify({
              auth_type: JSON.parse(is).auth_type,
              auth_id: `${JSON.parse(is).auth_id}`,
              name: JSON.parse(is).names || JSON.parse(is).name,
            })}
            style={{ marginBottom: '15px' }}
          >
            {JSON.parse(is).names || JSON.parse(is).name}
          </Radio>
        </Col>
      );
    });
  }
  //  iam  mi  ma
  renderHtml_one() {
    return this.state.default_lsOne.map((is, inx) => {
      return (
        <>
          <Radio
            value={JSON.stringify({
              auth_id: `${is.auth_id}`,
              name: is.name,
              auth_type: is.auth_type,
            })}
            style={{ marginLeft: '65px', marginBottom: '15px' }}
            key={inx}
          >
            {is.names}
          </Radio>
        </>
      );
    });
  }

  // 数组对象去重
  arr_obj(ls_objArray_ls) {
    return ls_objArray_ls.filter((item, index, arrs) => {
      return arrs.findIndex((el) => JSON.parse(el)['name'] == JSON.parse(item)['name']) == index;
    });
  }

  customOptions() {
    if (this.state.default_lsOne.length != 0) {
      return (
        <Form>
          <Row>
            <Col span={3} offset={1} style={{ textAlign: 'right' }}>
              <span>默认登录方式：</span>
            </Col>
            <Col span={20}>
              <Form.Item
                name="默认登录"
                rules={[{ required: true }]}
                style={{ width: '90%' }}
                // labelCol={{ span: 0 }}
                // wrapperCol={{ span: 21 }}
              >
                <Radio.Group
                  onChange={this.handleDefaultChange.bind(this)}
                  style={{
                    width: '100%',
                  }}
                  defaultValue={this.state.defalut_ls}
                >
                  <Row>{this.state.default_lsOne.length != 0 ? this.renderHtml() : ''}</Row>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      );
    }
  }

  //单点登录tab
  getSSOLoginTab() {
    const { appDetail = {} } = this.props;
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
      <Form
        onFinish={this.onSubmit}
        labelCol={{
          span: 18,
        }}
        ref={this.formRefs}
      >
        <Collapse
          defaultActiveKey={['auth_protocol']}
          bordered={false}
          style={{ backgroundColor: '#FFF' }}
        >
          <Panel header="登录配置" key="auth_protocol">
            <div style={{ marginLeft: '-1%' }}>
              <Checkbox.Group
                style={{
                  width: '100%',
                }}
                onChange={this.onChangeLocalhost.bind(this)}
                defaultValue={this.state.localTheEcheo}
              >
                <Row style={{ marginBottom: '20px' }}>
                  <Col span={3} offset={1} style={{ textAlign: 'right' }}>
                    <span>本地登录方式：</span>
                  </Col>
                  <Col span={6}>
                    <Checkbox
                      value={JSON.stringify({
                        name: 'pwd_enabled',
                        auth_type: 'PWD',
                        auth_id: -1,
                        names: 'IAM 用户名密码',
                      })}
                    >
                      IAM 用户名密码
                    </Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox
                      value={JSON.stringify({
                        name: 'sms_enabled',
                        auth_type: 'SMS',
                        auth_id: -1,
                        names: '短信验证码',
                      })}
                    >
                      短信验证码
                    </Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox
                      value={JSON.stringify({
                        name: 'email_enabled',
                        auth_type: 'EMAIL',
                        auth_id: -1,
                        names: '邮箱验证码',
                      })}
                    >
                      邮箱验证码
                    </Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
              <Checkbox.Group
                style={{
                  width: '100%',
                }}
                onChange={this.handleAuthenChange.bind(this)}
                defaultValue={this.state.auth_arr}
              >
                <Row>
                  <Col span={3} offset={1} style={{ textAlign: 'right' }}>
                    <span>企业认证登录：</span>
                  </Col>
                  <div style={{ width: '75%', display: 'flex', flexWrap: 'wrap' }}>
                    {this.renderCheckbox()}
                  </div>
                </Row>
              </Checkbox.Group>
              <Checkbox.Group
                style={{
                  width: '100%',
                }}
                onChange={this.handleMultifyChange.bind(this)}
                defaultValue={this.state.default_arr}
              >
                <Row style={{ marginBottom: '20px' }}>
                  <Col span={3} offset={1} style={{ textAlign: 'right' }}>
                    <span>多因子认证：</span>
                  </Col>
                  <Col span={6}>
                    <Checkbox value="SMS">短信验证码</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value="EMAIL">邮箱验证码</Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
              {this.customOptions()}
            </div>
          </Panel>
        </Collapse>

        <Collapse
          defaultActiveKey={['auth_protocol']}
          bordered={false}
          style={{ backgroundColor: '#FFF' }}
        >
          <Panel header="单点协议" key="auth_protocol">
            <Form.Item
              name="auth_protocol"
              labelCol={{ span: 8 }}
              {...formItemLayout1}
              label="请选择协议"
              initialValue={appDetail.auth_protocol || 'OIDC'}
            >
              <Radio.Group onChange={this.onChangeProtocol.bind(this)}>
                <Space size={60}>
                  <Radio value={'OIDC'}>OIDC</Radio>
                  <Radio value={'SAML'} style={{ marginLeft: '30px' }}>
                    SAML
                  </Radio>
                  <Radio value={'OAUTH'} style={{ marginLeft: '30px' }}>
                    OAuth2.0
                  </Radio>
                  <Radio value={'CAS'} style={{ marginLeft: '30px' }}>
                    CAS
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Panel>
        </Collapse>
        {this.renderOIDC()}
        {this.renderSAML()}
        {this.renderOauth()}
        {this.renderCas()}
        <div className="mt-30" style={{ textAlign: 'center' }}>
          <Button type="ghost" className="ml-10 fs-16" onClick={this.onClose.bind(this)}>
            取消
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="ml-10 fs-16"
            loading={this.state.loading}
          >
            确定
          </Button>
        </div>
      </Form>
    );
  }

  render() {
    return (
      <Spin
        size="large"
        spinning={this.state.loading}
        style={{ maxHeight: 'fit-content', backgroundColor: '#fff' }}
      >
        {this.getSSOLoginTab()}
      </Spin>
    );
  }
}
export default EditAppSso;
