export type AppListItemType = {
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
  auth_protocol?: string;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

interface returnObj {
  classList: any[];
}

export type VerifyRef = {
  current: {
    context: any;
    props: any;
    refs: any;
    renderUlList: () => void;
    updateClassList: (a: string) => returnObj;
    againRequest: () => void;
    state: any;
  };
  againRequest: () => void;
  updateClassList: (a: string) => returnObj;
};
