// @ts-ignore
/* eslint-disable */

declare namespace DIGITALSEE {
  type CurrentUser = {
    tenant_id?: String;
    sub?: String;
    zoneinfo?: String;
    birthdate?: String;
    gender?: String;
    telephone_number?: String;
    cert?: String;
    preferred_username?: String;
    locale?: String;
    type?: Number;
    create_by?: String;
    password_status?: String;
    update_time?: String;
    pwd_expired_time?: String;
    pwd_changed_time?: String;
    permissions?: Object;
    connector_uid?: Number;
    nickname?: String;
    connector_type?: Number;
    checksum?: Number;
    update_by?: String;
    email?: String;
    connector_sub_id?: Number;
    come_from?: String;
    website?: String;
    connector_batch_no?: String;
    address?: String;
    email_verified?: String;
    create_time?: Number;
    last_login?: String;
    profile?: String;
    phone_number_verified?: Boolean;
    org_ids?: Object;
    picture?: String;
    group_positions?: Object;
    name?: String;
    created_mode?: String;
    permissions_sets?: string[];
    phone_number?: Number;
    orgs?: Object;
    status?: String;
    username?: String;
    tags?: String[];
  };

  type LicData = {
    adm: {
      checked_value: boolean;
      dates: Array;
      expire: boolean;
    };
    app_sso: {
      checked_value: boolean;
      dates: Array;
      expire: boolean;
    };
    dlp: {
      checked_value: boolean;
      dates: Array;
      expire: boolean;
    };
    file_audit: {
      checked_value: boolean;
      dates: Array;
      expire: boolean;
    };
    gateway: {
      checked_value: boolean;
      dates: Array;
      expire: boolean;
    };
    risk_monitor: {
      checked_value: boolean;
      dates: Array;
      expire: boolean;
    };
    user_join: {
      checked_value: boolean;
      dates: Array;
      expire: boolean;
    };
  };
  interface USER_POLICE {
    user_create_verify: boolean;
    expire_remind_days: number;
    cycle_remind_days: number;
  }
  type ConfigsPolicies = {
    audit_policy: AuditPolicy;
    cross_region_login_alert_policy: CrossRegionLoginAlertPolicy;
    failed_login_alert_policy: FailedLoginAlertPolicy;
    login_policy: LoginPolicy;
    password_policy: PasswordPolicy;
    pwd_complexity: PasswordComplexity;
    selfservice: SelfService;
    signup_policy: SignupPolicy;
    user_policy: USER_POLICE;
    builtin_auth_method: any;
    uc_name: string;
    uc_logo: string;
  };

  type AuditPolicy = {
    max_age: number;
    audit_level: string;
  };

  type CrossRegionLoginAlertPolicy = {
    enabled: boolean;
    notify_user: boolean;
    notify_admin: boolean;
  };

  type FailedLoginAlertPolicy = {
    enabled: boolean;
    notify_user: boolean;
    notify_admin: boolean;
  };

  type LoginPolicy = {
    login_attrs: string[];
    sso_validity: number;
    qrcode_enable: boolean;
    message_verify_validity: string;
    email_verify_validity: string;
  };

  type PasswordPolicy = {
    admin_reset_user_pwd: boolean;
    pwd_must_change_for_admin_reset_pwd: boolean;
    pwd_must_change_for_admin_add_user: boolean;
    pwd_max_age: number;
    pwd_in_history: number;
    lock_duration: number;
    continuous_failure_count: number;
    white_list: any;
  };

  type PasswordComplexity = {
    min_len: number;
    max_len: number;
    require_num: number;
    require_upper_char: number;
    require_lower_char: number;
    require_spec_char: number;
    spec_char: string;
  };

  type SelfService = {
    allow_selfservice: boolean;
    allow_self_signup: boolean;
  };

  type SignupPolicy = {
    send_invitation_email: boolean;
    mandatory_attrs: string[];
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
