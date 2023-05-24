import { useMount, useSetState, useUpdateEffect } from 'ahooks';
import { useLocation } from 'umi';
import { getAppInfo, requestEnterpriseLogin } from '../authorScope/service';
import { LocalAuthMethodArray, StateType } from './loginConfig';
import { saveLoginConfig } from '../../../../server';
import _ from 'lodash';
import moment from 'moment';
import appUtil from '../authorScope/component/components/appUtil';
import { message } from 'antd';
// import AppInfoProfile from '../authorScope/component/components/AppInfo/AppInfoProfile';

export default ({ form, dispatch, handleStepsChange }: any) => {
  const location: any = useLocation();
  const client_id = location.query.client_id || sessionStorage.getItem('appClientId');
  const [state, setState] = useSetState<StateType<LocalAuthMethodArray>>({
    certificationEnterprise: [],
    defaultArray: [],
    loading: false,
    appsResult: {},

    saveTemplateConfig: [],
    appInfo: [],
  });

  /**
   * @Function 字符串对象-->转对象
   */
  const transformStrToObject = (stringifyArr: any[]) => {
    if (Array.isArray(stringifyArr)) {
      return stringifyArr.map((mapIs) => JSON.parse(mapIs));
    }
    return [stringifyArr];
  };

  /**
   * @description 请求企业认证源选项
   */
  const requestEnterpriseLoginFunction = () => {
    return requestEnterpriseLogin().then((rs) => {
      setState({
        certificationEnterprise: rs.data,
        loading: false,
      });
    });
  };

  const requestLoginConfigInfo = (client_ids: string) => {
    return getAppInfo({ client_id: client_ids }).then((rs) => {
      const localAuthMethod = rs?.login_policy?.local_auth_method;
      const localAuthMethodArray: LocalAuthMethodArray[] = [];
      const mapping = {
        pwd_enabled: {
          auth_type: 'PWD',
          auth_id: '-1',
          name: 'IAM 用户名密码',
        },
        sms_enabled: {
          auth_type: 'SMS',
          auth_id: '-1',
          name: '短信验证码',
        },
        email_enabled: {
          auth_type: 'EMAIL',
          auth_id: '-1',
          name: '邮箱验证码',
        },
      };
      for (const item in localAuthMethod) {
        if (localAuthMethod[item]) {
          localAuthMethodArray.push(mapping[item]);
        }
      }
      // 赋值默认登录方式数组 由企业认证回显数组 和 本地回显数组 组合。
      setState({
        defaultArray: rs?.login_policy?.third_auth_methods.concat(localAuthMethodArray),
        appsResult: rs,
        saveTemplateConfig: rs?.template_config?.template_config,
        appInfo: rs,
      });

      if (rs?.config?.times) {
        for (const items in rs?.config?.times) {
          rs.config.times[items] = [
            moment(rs?.config?.times[items][0]),
            moment(rs?.config?.times[items][1]),
          ];
        }
      }
      const copyConfig = { ...rs?.config };
      delete copyConfig?.times;
      const setCopyConfig = Object.assign({}, copyConfig, {
        // 本地方式 回显
        local_auth_method: localAuthMethodArray.map((mapIs) => JSON.stringify(mapIs)),
        // 企业认证方式 回显
        third_auth_methods: rs?.login_policy?.third_auth_methods.map((mapIs) =>
          JSON.stringify(mapIs),
        ),
        // 多因子方式 回显
        mfa: rs?.login_policy?.mfa,
        times: rs?.config?.times,
      });
      // 此处把后台给的秒数转换分钟
      setCopyConfig.access_token_timeout = parseInt(setCopyConfig.access_token_timeout / 60);
      setCopyConfig.refresh_token_timeout = parseInt(setCopyConfig.refresh_token_timeout / 3600);
      setCopyConfig.id_token_timeout = parseInt(setCopyConfig.id_token_timeout / 60);
      form.setFieldsValue(setCopyConfig);
      if (rs?.auth_protocol) {
        form.setFieldsValue({
          auth_protocol: rs?.auth_protocol,
        });
      }
    });
  };

  /**
   * @description { formValuesChange } 当form表单的change事件 任何form变化触发此函数
   */
  const formValuesChange = (changedValues, totalValues) => {
    const fieldObject = {
      local_auth_method: () => {
        setState({
          defaultArray: _.compact(
            transformStrToObject(changedValues['local_auth_method']).concat(
              transformStrToObject(totalValues?.third_auth_methods),
            ),
          ),
        });
      },
      third_auth_methods: () => {
        setState({
          defaultArray: _.compact(
            transformStrToObject(changedValues['third_auth_methods']).concat(
              transformStrToObject(totalValues?.local_auth_method),
            ),
          ),
        });
      },
    };
    const keys = Object.keys(changedValues);
    return fieldObject[keys[0]]?.();
  };

  const mergeAppDetail = (data: any) => {
    setState((states) => {
      return {
        appInfo: {
          ...states.appInfo,
          ...data,
        },
      };
    });
  };

  // oauth的
  const getUriss = (values) => {
    const uris: any = [];
    for (const key in values) {
      if (key.startsWith('uriss-')) {
        uris.push(values[key]);
      }
    }
    return uris.filter((k) => k.length > 0);
  };
  // OIDC
  const getUris = (values: any) => {
    const uris: any = [];
    for (const key in values) {
      if (key.startsWith('uris-')) {
        uris.push(values[key]);
      }
    }
    return uris.filter((k) => k.length > 0);
  };
  // cas的
  const getUrisss = (values) => {
    const uris: any = [];
    for (const key in values) {
      if (key.startsWith('urisss-')) {
        uris.push(values[key]);
      }
    }
    return uris.filter((k) => k.length > 0);
  };
  useMount(() => {
    dispatch({
      type: 'component_configs/modifyTestPageLoading',
      payload: true,
    });
    setTimeout(async () => {
      await requestEnterpriseLoginFunction();
      await requestLoginConfigInfo(sessionStorage.getItem('transformClient') || client_id);
      dispatch({
        type: 'component_configs/modifyTestPageLoading',
        payload: false,
      });
    }, 500);
  });

  /**
   * @Function 判断传进来数组长度是否大于0并且元素类型是JSON类型
   */
  const judgment = (arr) => arr.length && _.isString(arr[0]);
  /**
   * @Function 对JSON数组进行转换为对象数组
   */
  const jsonTransformObject = (values, keyStr) => {
    values[keyStr] = values[keyStr].map((mapIs) => JSON.parse(mapIs || '{}'));
  };

  const formSubmit = (siblingRef$: any, currentStep?: any, grant_tye?: any) => {
    let saveData: any = {};
    let config: any;
    const { validateFields } = form;
    return validateFields()
      .then((values) => {
        if (
          (values?.local_auth_method?.length == 0 ||
            values?.local_auth_method?.length == undefined) &&
          (values?.third_auth_methods?.length == 0 ||
            values?.third_auth_methods?.length == undefined)
        ) {
          message.error('请至少选择一种认证方式!');
          return false;
        }

        if (values.auth_protocol == 'OIDC') {
          if (appUtil.hasRedirectURI('web')) {
            values.redirect_uris = getUris(values);
            values.client_id = client_id;
            values.auth_protocol = 'OIDC';
          }
          values.user_profile = grant_tye?.OIDCData;
          values.grant_type = values?.oidcGrantType;
          values.access_token_timeout = values?.access_token_timeout * 60;
          values.id_token_timeout = values?.id_token_timeout * 60;
          values.refresh_token_timeout = values?.refresh_token_timeout * 60 * 60;
          saveData = { ...values };
        } else if (values.auth_protocol == 'SAML') {
          saveData = { config: values };
          saveData.config.assertion_attributes = grant_tye?.OIDCData;
          saveData.config.grant_tye = grant_tye?.grant_type;
          const objs = {
            response_signed: true,
            assertion_signed: true,
            signature_algorithm: 'RSA-SHA256',
            digest_algorithm: 'SHA256',
            name_id_format: 'none',
            autofill_setting: 'username',
          };
          // 处理values值为undefined 传递后台时异常
          const ls_Obj = {};
          for (const j in values) {
            if (values[j] != undefined) {
              ls_Obj[j] = values[j];
            }
          }
          // 处理saveData.config值为undefined传递后台时异常
          const ls_Obj_One = {};
          for (const j in saveData.config) {
            if (saveData.config[j] != undefined) {
              ls_Obj_One[j] = saveData.config[j];
            }
          }
          const objCopy = {};
          const objArray = [objs, ls_Obj_One, state.appInfo.config, ls_Obj];
          objArray.forEach((forIs) => {
            for (const i in forIs) {
              objCopy[i] = forIs[i];
            }
          });
          saveData.config = objCopy;
        } else if (values.auth_protocol == 'CAS') {
          saveData.auth_protocol = values.auth_protocol;
          saveData.client_id = client_id;
          if (appUtil.hasRedirectURI('web')) {
            saveData.redirect_uris = getUrisss(values);
          }
        } else if (values.auth_protocol == 'OAUTH') {
          values.access_token_timeout = values?.access_token_timeout * 60;
          values.refresh_token_timeout = values?.refresh_token_timeout * 60 * 60;

          saveData = { ...values };
          saveData.redirect_uris = getUriss(values);
          saveData.grant_type = values?.grantType;
        }
        // return;
        // 动态修改时间moment格式
        if (values['times']) {
          for (const item in values['times']) {
            if (values['times'][item]) {
              const momentArray = values['times'][item];
              values['times'][item] = [
                momentArray[0].format('YYYY-MM-DD'),
                momentArray[1].format('YYYY-MM-DD'),
              ];
            }
          }
        }
        // 转JSON字符串为对象格式
        if (_.isString(values?.default_auth)) {
          values.default_auth = JSON.parse(values?.default_auth || '{}');
        }
        if (judgment(values?.local_auth_method || [])) {
          jsonTransformObject(values, 'local_auth_method');
        }
        if (judgment(values?.third_auth_methods || [])) {
          jsonTransformObject(values, 'third_auth_methods');
        }
        const includesArr = ['third_auth_methods', 'local_auth_method', 'default_auth', 'mfa'];
        const login_policy = Object.entries(values).filter((filIs) =>
          includesArr.includes(filIs[0]),
        );

        // 对应协议使用对应的数据结构
        if (values.auth_protocol == 'SAML') {
          for (const isSaml in values) {
            if (isSaml.includes('uriss-')) {
              delete values[isSaml];
            }
          }

          for (const isSamlSave in saveData.config) {
            if (isSamlSave.includes('uriss-')) {
              delete saveData.config[isSamlSave];
            }
          }
          delete saveData?.config?.auth_protocol;
          config = Object.entries({ ...values, ...saveData.config }).filter(
            (filIs) => !includesArr.includes(filIs[0]),
          );
        } else if (values.auth_protocol == 'CAS') {
          const tempValues = { ...values };
          for (const is in tempValues) {
            if (is.includes('urisss-')) {
              delete tempValues[is];
            }
          }
          config = Object.entries({ ...tempValues, ...saveData }).filter(
            (filIs) => !includesArr.includes(filIs[0]),
          );
        } else if (values.auth_protocol == 'OAUTH') {
          delete values?.grantType;
          delete saveData?.grantType;
          delete saveData?.oidcGrantType;
          delete saveData?.auth_protocol;
          for (const auth in values) {
            if (auth.includes('uriss-')) {
              delete values[auth];
            }
          }
          for (const authSave in saveData) {
            if (authSave.includes('uriss-')) {
              delete saveData[authSave];
            }
          }
          config = Object.entries({ ...values, ...saveData }).filter(
            (filIs) => !includesArr.includes(filIs[0]),
          );
        } else if (values.auth_protocol == 'OIDC') {
          const tempValues = { ...values };
          for (const is in tempValues) {
            if (is.includes('uris-')) {
              delete tempValues[is];
            }
          }
          for (const isSave in saveData) {
            if (isSave.includes('uris-')) {
              delete saveData[isSave];
            }
          }
          delete tempValues?.oidcGrantType;
          delete tempValues?.auth_protocol;
          delete saveData?.oidcGrantType;
          delete saveData?.auth_protocol;

          config = Object.entries({ ...tempValues, ...saveData }).filter(
            (filIs) => !includesArr.includes(filIs[0]),
          );
        } else {
          config = Object.entries({ ...values }).filter((filIs) => !includesArr.includes(filIs[0]));
        }
        const loginObj = {
          email_enabled: false,
          pwd_enabled: false,
          sms_enabled: false,
        };
        const obj: any = Object.fromEntries(login_policy);
        obj.local_auth_method.forEach((forIs) => {
          if (forIs.name == 'IAM 用户名密码') {
            loginObj['pwd_enabled'] = true;
          }
          if (forIs.name == '短信验证码') {
            loginObj['sms_enabled'] = true;
          }
          if (forIs.name == '邮箱验证码') {
            loginObj['email_enabled'] = true;
          }
        });
        obj.local_auth_method = loginObj;
        /**
         * @description 再提交之前进行保存login的配置项
         */
        saveLoginConfig(
          sessionStorage.getItem('transformClient') || client_id,
          Object.fromEntries(config),
          obj,
          values?.auth_protocol,
        );
        handleStepsChange(2);
        return true;
      })
      .catch(() => {});
  };

  useUpdateEffect(() => {
    // 默认登录方式 回显
    form.setFieldsValue({
      default_auth: JSON.stringify(state.appsResult.login_policy?.default_auth),
    });
  }, [state.defaultArray]);
  return {
    state,
    requestEnterpriseLoginFunction,
    requestLoginConfigInfo,
    formValuesChange,
    formSubmit,
    mergeAppDetail,
  };
};
