export type UserType = {
  come_from?: string;
  created_mode?: string;
  email?: string;
  name: string;
  org_ids?: any[];
  orgs?: string[];
  phone_number?: string;
  picture?: string;
  status?: string;
  sub?: number;
  username: string;
  picture?: string;
  readonly?: boolean;
  email_verified?: true;
  gender?: string;
  group_positions?: string;
  nickname?: string;
  password?: string;
  password_status?: string;
  phone_number_verified?: boolean;
};

export type UserAnotherType = {
  come_from?: string;
  created_mode?: string;
  email?: string;
  name: string;
  org_ids?: any[];
  orgs?: OrgAnotherType[];
  phone_number?: string;
  picture?: string;
  status?: string;
  sub?: number;
  username: string;
  picture?: string;
  readonly?: boolean;
  email_verified?: true;
  gender?: string;
  group_positions?: GroupPositionType[];
  nickname?: string;
  password?: string;
  password_status?: string;
  phone_number_verified?: boolean;
  create_time: number;
  pwd_changed_time: number;
  pwd_expired_time: number;
  start_date?: string | number;
  end_date?: string | number;
  telephone_number?: string;
  user_job_number?: string;
};

export type OrgAnotherType = {
  name: string;
  org_name?: string; // self/userInfo 返回的
  id: string;
};

export type GroupPositionType = {
  position: string;
  user_code: string;
  org_id: string;
  org_name: string;
};

export type OrgType = {
  children: OrgType[];
  description: string;
  id: string;
  name: string;
  readonly: boolean;
  parentRefId?: string;
  parent?: any;
  num_of_children?: number;
  num_of_users?: number;
  entitled?: boolean;
};

export type SyncGeneType = {
  config_id: string;
  create_by: string;
  create_time: string;
  delete_limit: number;
  failure_send_max_times: string;
  failure_send_period: string;
  failure_send_period_type: string;
  id: string;
  name: string;
  next_push_time: string;
  push_batch_no: number;
  push_end_time: string;
  push_period: number;
  push_start_time: string;
  push_status: string;
  push_time: string;
  root_group_id: string[];
  status: string;
  sync_type: string;
  type: string;
  update_by: string;
  update_time: string;
};

export type LinkerType = {
  admin_account: string;
  admin_password: string;
  config: LinkerConfiigType;
  config_id: string;
  conflict_policy: boolean;
  create_default_org: boolean;
  delete_limit: number;
  ds_type: string;
  email_verified: boolean;
  format_string: any;
  host: string;
  id: number;
  import_orgs: boolean;
  import_period: number;
  import_status: string;
  last_import_finish_datetime: number;
  last_import_start_datetime: number;
  map_attrs: any;
  map_org_attrs: any;
  org_filter: string;
  phone_number_verified: boolean;
  port: string;
  profile_name: string;
  status: string;
  sync_batch_no: number;
  test_account: string;
  tls: string;
  user_base_dn: string;
  user_filter: string;
};

export type LinkerConfiigType = {
  datasource_id: string;
  etl_password: string;
  etl_port: string;
  etl_server: string;
  etl_user: string;
};
