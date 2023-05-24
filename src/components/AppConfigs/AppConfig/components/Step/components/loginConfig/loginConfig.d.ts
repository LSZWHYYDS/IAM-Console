export type LocalAuthMethodArray = {
  auth_type: string;
  auth_id: number;
  name: string;
};

export type localAuthMethodType = {
  pwd_enabled: boolean;
  sms_enabled: boolean;
  email_enabled: boolean;
};

export type StateType<T> = {
  certificationEnterprise: T[];
  defaultArray: T[];
  loading: boolean;
  appsResult: any;
  saveTemplateConfig?: any;
  appInfo: any;
};
export type formType = {
  local_auth_method: LocalAuthMethodArray[];
  third_auth_methods: LocalAuthMethodArray[];
  default_auth: LocalAuthMethodArray[];
};
