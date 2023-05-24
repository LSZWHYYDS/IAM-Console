import React from 'react';
import { errorCode, t } from '@/utils/common.utils';
import { Tooltip } from 'antd';

let auditUtil = {
  EventSubtype: {
    0: 'ALL',
    // For LOGIN
    101: 'SIGNIN',
    102: 'SIGNOUT',
    103: 'AUTHORIZE',
    104: 'AUTHORIZE_TOKEN',
    105: 'AUTHORIZE_QRCODE',
    106: 'AUTHORIZE_AGREE',
    107: 'AUTHORIZE_REFUSE',
    // Common for all
    201: 'NEW',
    202: 'UPDATE',
    203: 'DELETE',
    204: 'DISABLE',
    205: 'ENABLE',
    206: 'CSV_IMPORT',
    207: 'AD_LDAP_IMPORT',
    // For USER
    301: 'RESET_PASSWORD',
    302: 'ENABLE_USER_CERT',
    303: 'DISABLE_USER_CERT',
    304: 'DELETE_USER_CERT',
    // For ORG
    401: 'JOIN_ORG',
    402: 'LEAVE_ORG',
    403: 'MOVE_ORG',
    // For tag
    501: 'USER_TAG',
    502: 'REMOVE_USER_TAG',
    // For SELFSERVICE
    601: 'SELF_USER_REGISTER',
    602: 'CHANGE_PASSWORD',
    603: 'SELF_RESET_PASSWORD',
    604: 'FORGET_PASSWORD',
    605: 'UPDATE_USERINFO',
    606: 'VERIFY_EMAIL_REQUEST',
    607: 'VERIFY_EMAIL',
    608: 'VERIFY_MOBILE_CODE_REQUEST',
    609: 'VERIFY_MOBILE',
    610: 'FORGET_PASSWORD_MOBILE_CODE_REQUEST',
    611: 'REVOKE_APP_AUTH',
    612: 'UPLOAD_CERT',
    613: 'REQUEST_CERT_ACTIVECODE',
    614: 'DELETE_CERT',
    615: 'DISABLE_CERT',
    616: 'ENABLE_CERT',
    617: 'GET_ONETIME_PASSWORD',
    618: 'REVOKE_APP_SINGLE_TOKEN', // delete one token
    619: 'REVOKE_APP_TOKEN', // delete specified app user token
    620: 'REVOKE_APP_OTHER_TOKEN',
    621: 'REVOKE_USER_TOKEN',
    // For APPLICATION
    701: 'ROTATE_CLIENT_SECRET',
    702: 'USER_ENTITLEMENT',
    703: 'REVOKE_USER_ENTITLEMENT',
    704: 'ORG_ENTITLEMENT',
    705: 'REVOKE_ORG_ENTITLEMENT',
    706: 'TAG_ENTITLEMENT',
    707: 'REVOKE_TAG_ENTITLEMENT',
    708: 'NEW_PERMISSION',
    709: 'UPDATE_PERMISSION',
    710: 'DELETE_PERMISSION',
    711: 'NEW_PERMISSION_SET',
    712: 'UPDATE_PERMISSION_SET',
    713: 'DELETE_PERMISSION_SET',
    714: 'NEW_ROLE',
    715: 'UPDATE_ROLE',
    716: 'DELETE_ROLE',
    717: 'NEW_USER_ROLE_BINDING',
    718: 'UPDATE_USER_ROLE_BINDING',
    719: 'DELETE_USER_ROLE_BINDING',
    720: 'NEW_ORG_ROLE_BINDING',
    721: 'UPDATE_ORG_ROLE_BINDING',
    722: 'DELETE_ORG_ROLE_BINDING',
    723: 'NEW_TAG_ROLE_BINDING',
    724: 'UPDATE_TAG_ROLE_BINDING',
    725: 'DELETE_TAG_ROLE_BINDING',
    726: 'UPDATE_APP_LOGIN_POLICY',
    727: 'ROTATE_CLIENT_SIGNATURE_SECRET,',
    //For ACCESS_CONTROL
    801: 'ROLE_ASSIGNMENT',
    802: 'REVOKE_ROLE_ASSIGNMENT',
    // For SETTING
    901: 'UPDATE_ALL_POLICY',
    902: 'UPDATE_SMTP',
    903: 'UPDATE_SMS',
    904: 'UPDATE_PASSWORD_POLICY',
    905: 'UPDATE_LOGIN_POLICY',
    906: 'UPDATE_TEMPLATE',
    // For DS
    1001: 'CREATE_DS_CONFIG',
    1002: 'UPDATE_DS_CONFIG',
    1003: 'DELETE_DS_CONFIG',
    1004: 'ENABLE_DS_CONFIG',
    1005: 'DISABLE_DS_CONFIG',
    // FOR LOGIN_POLICY
    1101: 'SET_AS_DEFAULT',
    // FOR PUSH_CONNECTOR
    1201: 'SYNC',
    1202: 'BATCH_SYNC',
  },
  /**
   * check if the error_code is a SUCCESS or a failure .
   * @param {string} errCode event.error_code
   */
  isSuccess(errCode) {
    return errCode === this.Result.SUCCESS;
  },

  /**
   * render the result column for login log.
   * @param {string} errCode  event.error_code
   * @param {object} record an audit log record
   */
  renderResultForLoginLog(errCode, record, EventSubtype) {
    if (this.isSuccess(errCode)) {
      const { event_subtype: subtype } = record,
        i18nKey = 'audit.login.subs.' + EventSubtype[subtype].toLowerCase(),
        i18nText = t(i18nKey, record);
      return i18nText || t('audit.result.ok');
    } else {
      return t('audit.result.failure');
    }
  },

  /**
   * render the error description for login log, which will be displayed as a tooltip
   * @param {string} errCode event.error_code
   * @param {string} errDesc event.error_description
   */
  renderErrDescForLoginLog(errCode, errDesc) {
    if (this.isSuccess(errCode)) {
      return null;
    }

    return errCode + ': ' + (errorCode[errCode] || errDesc || t('audit.result.failure'));
  },

  /**
   * render the result column for system log.
   * @param {object} record system log record
   */
  renderResultForSystemLog(record) {
    const { error_code: errCode, error_description: errDesc } = record;

    if (this.isSuccess(errCode)) {
      return t('audit.result.ok');
    } else {
      if (errDesc === 'Server Unknown Error') {
        return '服务器未知错误';
      }
      return errorCode[errCode] || errDesc || t('audit.result.failure');
    }
  },
  /**
   * render the tooltip for target
   * @param {object} record system log record
   */
  renderTargetToolTip(record) {
    const { event_type: type, event_subtype: subtype, parameters: paramsStr } = record,
      params = JSON.parse(paramsStr);
    let text = '';

    switch (type) {
      case 'EXT_ATTR':
      case 'USER_EXT_ATTR':
        switch (subtype) {
          case 'NEW':
            if (params) {
              const p = params.ext_attrs[0];
              text = `${p.domain_name}: ${p.display_name}`;
            }
            break;
          case 'UPDATE':
            if (params) {
              text = `${record.target_name}: ${params.display_name}`;
            } else {
              text = record.target_name;
            }
            break;
          default:
            break;
        }
        break;
      case 'ORG_EXT_ATTR':
        switch (subtype) {
          case 'NEW':
            if (params) {
              const p = params.ext_attrs[0];
              text = `${p.domain_name}: ${p.display_name}`;
            }
            break;
          case 'UPDATE':
            if (params) {
              text = `${record.target_name}: ${params.display_name}`;
            } else {
              text = record.target_name;
            }
            break;
          default:
            break;
        }
        break;
      case 'APP':
        switch (subtype) {
          case 'USER_ENTITLEMENT':
          case 'REVOKE_USER_ENTITLEMENT':
            if (params && params.user_ids) {
              text = 'user_ids: ' + params.user_ids.join(', ');
            }
            break;
          case 'ORG_ENTITLEMENT':
          case 'REVOKE_ORG_ENTITLEMENT':
            if (params && params.org_id) {
              text = `org_id: ${params.org_id === '_null' ? t('org.defaultOrg') : params.org_id}`;
            }
            break;
          default:
            break;
        }
        break;
      case 'USER':
        switch (subtype) {
          case 'ENABLE':
          case 'DISABLE':
            if (params && params.uids) {
              text = 'user_ids: ' + params.uids.join(', ');
            }
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }

    return text || this.defaultTargetToolTip(record);
  },

  defaultTargetToolTip(record) {
    return record.target_id ? `${record.target_id}` : '';
  },

  /**
   * render the text of target col
   * @param {object} record  system log record
   */
  renderTargetText(record) {
    const { event_type: type, event_subtype: subtype, parameters: paramsStr } = record,
      params = JSON.parse(paramsStr);
    let text = '';
    switch (type) {
      case 'EXT_ATTR':
      case 'USER_EXT_ATTR':
        switch (subtype) {
          case 'NEW':
            if (params) {
              const p = params.ext_attrs[0];
              text = p.display_name;
            }
            break;
          case 'UPDATE':
            if (params) {
              text = `${params.display_name}`;
            }
            break;
        }
        break;
      case 'ORG_EXT_ATTR':
        switch (subtype) {
          case 'NEW':
            if (params) {
              const p = params.ext_attrs[0];
              text = p.display_name;
            }
            break;
          case 'UPDATE':
            if (params) {
              text = `${params.display_name}`;
            }
            break;
        }
        break;
      case 'USER':
        switch (subtype) {
          case 'ENABLE':
          case 'DISABLE':
            if (params && params.uids) {
              text = params.uids.join(', ');
            }
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }

    return text || this.defaultTargetText(record);
  },

  defaultTargetText(record) {
    return record.target_name || record.target_id;
  },

  /**
   * render device model
   * @param {object} record audit log record
   */
  renderDeviceModel(record) {
    return (
      <Tooltip title={record.src_user_agent}>
        <span>{record.src_device_model}</span>
      </Tooltip>
    );
  },

  // audit log result
  Result: {
    SUCCESS: '0',
    FAILURE: '1',
  },

  EventType: {
    ALL: {
      subtypes: [],
    },
    // LOGIN: {
    //     subtypes: [
    //         "SIGNIN", "SIGNOUT", "AUTHORIZE", "AUTHORIZE_TOKEN", "AUTHORIZE_QRCODE"
    //     ],
    // },
    USER: {
      subtypes: [
        'NEW',
        'UPDATE' /*"DELETE", "CSV_IMPORT", "AD_LDAP_IMPORT", "ENABLE", "DISABLE", "RESET_PASSWORD",
                "ENABLE_USER_CERT", "DISABLE_USER_CERT", "DELETE_USER_CERT",*/,
      ],
    },
    // EXT_ATTR: {
    //     subtypes: [
    //         "NEW", "UPDATE",
    //     ],
    // },
    // USER_EXT_ATTR: {
    //     subtypes: [
    //         "NEW", "UPDATE"
    //     ],
    // },
    // ORG_EXT_ATTR: {
    //     subtypes: [
    //         "NEW", "UPDATE"
    //     ],
    // },
    // TAG: {
    //     subtypes: [
    //         "NEW", "UPDATE", "DELETE","USER_TAG","REMOVE_USER_TAG"
    //     ],
    // },
    DS: {
      subtypes: [
        'CREATE_DS_CONFIG',
        'UPDATE_DS_CONFIG',
        /*"DELETE_DS_CONFIG",*/ 'ENABLE_DS_CONFIG',
        'DISABLE_DS_CONFIG',
      ],
    },
    // ORG: {
    //     subtypes: [
    //         "NEW", "UPDATE", "DELETE", "MOVE_ORG", "JOIN_ORG", "LEAVE_ORG",
    //     ],
    // },
    SELFSERVICE: {
      subtypes: [
        /*"SELF_USER_REGISTER", "FORGET_PASSWORD",*/ 'CHANGE_PASSWORD',
        /*"SELF_RESET_PASSWORD",
                "VERIFY_EMAIL_REQUEST","VERIFY_EMAIL",
                "VERIFY_MOBILE_CODE_REQUEST", "VERIFY_MOBILE", */ 'FORGET_PASSWORD_MOBILE_CODE_REQUEST',
        'UPDATE_USERINFO' /*"REVOKE_APP_AUTH",
                "REQUEST_CERT_ACTIVECODE","UPLOAD_CERT", "DELETE_CERT", "DISABLE_CERT", "ENABLE_CERT",*/,
        'GET_ONETIME_PASSWORD' /*"REVOKE_APP_SINGLE_TOKEN","REVOKE_APP_TOKEN","REVOKE_APP_OTHER_TOKEN","REVOKE_USER_TOKENS"*/,
      ],
    },
    APP: {
      subtypes: [
        'NEW',
        'UPDATE',
        'DELETE',
        'DISABLE',
        'ENABLE',
        'ROTATE_CLIENT_SECRET',
        'USER_ENTITLEMENT',
        'REVOKE_USER_ENTITLEMENT',
        'ORG_ENTITLEMENT',
        'REVOKE_ORG_ENTITLEMENT',
        // "TAG_ENTITLEMENT", "REVOKE_TAG_ENTITLEMENT",
        'NEW_PERMISSION',
        'UPDATE_PERMISSION',
        'DELETE_PERMISSION',
        'NEW_PERMISSION_SET',
        'UPDATE_PERMISSION_SET',
        'DELETE_PERMISSION_SET',
        'NEW_ROLE',
        'UPDATE_ROLE',
        'DELETE_ROLE',
        'NEW_USER_ROLE_BINDING',
        'UPDATE_USER_ROLE_BINDING',
        'DELETE_USER_ROLE_BINDING',
        'NEW_ORG_ROLE_BINDING',
        'UPDATE_ORG_ROLE_BINDING',
        'DELETE_ORG_ROLE_BINDING',
        // "NEW_TAG_ROLE_BINDING", "UPDATE_TAG_ROLE_BINDING", "DELETE_TAG_ROLE_BINDING",
        'UPDATE_APP_LOGIN_POLICY',
        'ROTATE_CLIENT_SIGNATURE_SECRET',
      ],
    },
    SETTING: {
      subtypes: [
        'UPDATE_SMTP',
        'UPDATE_PASSWORD_POLICY',
        'UPDATE_LOGIN_POLICY',
        'UPDATE_SMS',
        'UPDATE_ALL_POLICY',
        'UPDATE_TEMPLATE',
      ],
    },
    // SYNC: {
    //     subtypes: [
    //         // "CHANGE_PASSWORD"
    //     ],
    // },
    LOGIN_POLICY: {
      subtypes: ['NEW', 'UPDATE', 'DELETE', 'DISABLE', 'ENABLE', 'SET_AS_DEFAULT'],
    },
    AUTH_FACTOR: {
      subtypes: ['UPDATE', 'DISABLE', 'ENABLE'],
    },
    SNS_CONFIG: {
      subtypes: [/*"NEW",*/ 'UPDATE' /*"DELETE", "SET_AS_DEFAULT"*/],
    },
    PUSH_CONNECTOR: {
      subtypes: ['NEW', 'UPDATE', /*"DELETE",*/ 'DISABLE', 'ENABLE', 'SYNC', 'BATCH_SYNC'],
    },
    // PROFILE: {
    //     subtypes: [
    //         "NEW", "UPDATE", "DELETE"
    //     ],
    // }
  },

  /**
   * return event type/subtype i18n key
   * @param {*} evtType event type
   * @param {*} evtSubtype  event subtype
   */
  eventTypeI18nKey(evtType, evtSubtype) {
    const prefix = 'audit.system.evt_types.' + evtType.toLowerCase();

    if (evtSubtype) {
      if ('ALL' == evtSubtype.toUpperCase()) {
        return 'audit.system.evt_types.all.text';
      }
      return prefix + '.subs.' + evtSubtype.toLowerCase();
    } else {
      return prefix + '.text';
    }
  },

  syslogResultI18nKey(evtType, evtSubtype, errCode) {
    if (this.isSuccess(errCode)) {
      return (
        'audit.system.evt_types.' + evtType.toLowerCase() + '.success.' + evtSubtype.toLowerCase()
      );
    } else {
      return (
        'audit.system.evt_types.' + evtType.toLowerCase() + '.failure.' + evtSubtype.toLowerCase()
      );
    }
  },

  /**
   * render the filter header column for a specific event type
   * @param {string} evtType event.event_type
   */
  eventTypeHeaderColText(evtType) {
    const prefix = '操作类型',
      type = t(this.eventTypeI18nKey(evtType));

    return `${prefix}(${type})`;
  },

  /**
   * render the filter header column for a specific event subtype
   * @param {string} evtType event.event_type
   * @param {string} evtSubType event.event_subtype
   */
  eventSubtypeHeaderColText(evtType, evtSubType) {
    const prefix = '具体操作',
      type = t(this.eventTypeI18nKey(evtType, evtSubType));

    return `${prefix}(${type})`;
  },
};

export default auditUtil;
