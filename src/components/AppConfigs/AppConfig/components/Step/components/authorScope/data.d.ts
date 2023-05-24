export type AppListItemType = {
  link_client_id: any;
  custom_class: any;
  client_id: string;
  client_name?: string;
  application_type: string;
  client_id_issued_at?: number;
  status?: string;
  whitelisted?: boolean;
  public_access?: boolean;
  tenant_owner?: string;
  public_to_tenant?: number;
  read_only?: boolean;
  update_time?: number;
  app_src?: string;
  belong_corp?: string;
  gw_status?: string;
  logo_uri?: string;
  auth_protocol: string;
};

export type AppInfoType = {
  access_token_timeout: number;
  application_type: string;
  auth_protocol: string;
  cert_pem: string;
  cert_thumbprint: string;
  cli_mode_enable: boolean;
  client_id: string;
  client_id_issued_at: number;
  client_name: string;
  client_secret: string;
  client_secret_expires_at: number;
  client_uri: string;
  custom_class: string;
  description: string;
  enforce_https: boolean;
  id_token_timeout: number;
  login_policy: LoginPolicyType;
  open_app_auth_id: number;
  public_access: boolean;
  public_key: string;
  public_to_tenant: number;
  qrcode_enable: boolean;
  read_only: boolean;
  refresh_token_timeout: number;
  signature_secret: string;
  signing_alg: string;
  status: string;
  tenant_owner: string;
  update_time: number;
  user_profile_detail: any;
  webhook_enable: boolean;
  whitelisted: boolean;
};

export type LoginPolicyType = {
  as_default: boolean;
  auth_by: string;
  create_by: string;
  create_time: number;
  description: string;
  id: string;
  mfa: string[];
  name: string;
  primary_auth_method: { pwd_enabled: boolean; sms_enabled: boolean; email_enabled: boolean };
  status: string;
  tenant_id: string;
  update_by: string;
  update_time: number;
};

export type UserProfileDetailType = {
  create_by: string;
  create_time: string;
  domains: any;
  id: string;
  name: string;
  type: string;
  update_by: string;
  update_time: string;
};

export type PersonasType = {
  create_by: string;
  create_time: string;
  id: string;
  name: string;
  type: string;
  update_by: string;
  update_time: string;
};

export type UserAttrsType = {
  as_claim: boolean;
  as_import: boolean;
  as_profile: boolean;
  basic_attribute: boolean;
  constraint_rule: string;
  data_type: string;
  description: string;
  display_name: string;
  domain_name: string;
  extra_auth_factor: boolean;
  field_type: string;
  id: string;
  mandatory: boolean;
  op_constraint: number;
  searchable: boolean;
  single_value: boolean;
  unique: boolean;
};

export type GatewayConfigsType = {
  access_prefix: string;
  client_id: string;
  path_strip_prefix: number;
  predicate_type: number;
  route_url: string;
  status: number;
  host_addr: string;
};

export type AppUserType = {
  email: string;
  name: string;
  username: string;
  picture: string;
  sub: number;
};
