export type loginHelloType = {
  result?: boolean;
  error?: string;
  error_description?: string;
  data?: loginHelloDataType;
};

export type loginHelloDataType = {
  next?: string;
  tip?: loginHelloDataTipType;
  continue?: boolean;
};

export type loginHelloDataTipType = {
  primary_auth?: object;
  login_meta?: object;
  secure_login?: object;
  basic_info?: object;
};

export type primaryAuthType = {
  pwd_enabled?: boolean;
  sms_enabled?: boolean;
  email_enabled?: boolean;
};

export type loginMetaType = {
  allow_register?: boolean;
  qr_code_enabled?: boolean;
  register_url?: string;
  place_holder?: string;
};

export type secureLogin = {
  public_key?: string;
  kid?: string;
  client_id?: string;
  nonce?: string;
  expires_in?: number;
  secure_login_enable?: boolean;
};
export type basicInfo = {
  uc_version?: string;
  uc_name?: string;
  tenant_id?: string;
  tenant_id_visible?: boolean;
};

export type loginHelloTipType = {
  loginHelloData?: object;
  tenant_id?: string;
  client_id?: string;
  secureLoginEnable?: boolean;
  publicKey?: string;
  kid?: string;
  pwdEnabled?: boolean;
  smsEnabled?: boolean;
  emailEnabled?: boolean;
  otpEnabled?: boolean;
  otpShow?: boolean;
};
