export type LinkerType = {
  admin_account?: string;
  admin_password?: string;
  config?: any;
  config_id?: string;
  conflict_policy?: boolean;
  create_default_org?: boolean;
  delete_limit?: number;
  ds_type?: string;
  email?: string;
  email_verified?: true;
  endTime?: number;
  format_string?: string;
  gender?: string;
  host?: string;
  id?: number;
  import_orgs?: true;
  import_period?: number;
  import_status?: null;
  last_import_finish_datetime?: number;
  last_import_start_datetime?: number;
  map_attrs?: any;
  map_org_attrs?: any;
  name?: string;
  nickname?: string;
  org_filter?: null;
  phone_number?: string;
  phone_number_verified?: true;
  port?: null;
  profile_name?: string;
  startTime?: number;
  status?: string;
  sync_batch_no?: 121;
  telephone_number?: string;
  test_account?: string;
  tls?: null;
  user_base_dn?: null;
  user_filter?: null;
  username?: string;
  username_format?: string;
  push_period?: string;
  outer_dept?: string;
  sync_type?: string;
  root_group_id?: string;
};
export type ConfigTip = {
  AD?: LinkerType;
  DINGDING?: LinkerType;
  ETL?: LinkerType;
  LDAP?: LinkerType;
  WEWORK?: LinkerType;
};
export type SubAttrType = {
  display_name?: string;
  domain_name?: string;
};
