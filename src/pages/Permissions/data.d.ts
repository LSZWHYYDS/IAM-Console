import type { UserType } from '@/pages/UserCenter/data';

export type RoleType = {
  client_id?: string;
  create_mode?: string;
  description?: string;
  display_name?: string;
  name?: string;
  permission_sets?: string[];
  permissions?: any;
};

export type AdminType = {
  binding_scopes: any;
  user: UserType;
};
