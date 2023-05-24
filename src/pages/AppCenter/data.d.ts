export type AppType = {
  adamId: number;
  appSize?: number;
  size?: number;
  status?: number;
  assignedCount?: number;
  availableCount?: number;
  b2bCustomApp?: string;
  brief?: string;
  company?: string;
  createTime?: string;
  defaultApp?: boolean;
  description?: string;
  deviceAssignable?: string;
  icon?: string;
  id: string;
  irrevocable?: string;
  modelType?: string;
  name?: string;
  appName?: string;
  osVersion?: string;
  pkgName?: string;
  price?: string;
  pricingParam?: string;
  productTypeId?: number;
  productTypeName?: string;
  refreshed?: boolean;
  retiredCount?: number;
  source?: string;
  totalCount?: number;
  updateTime?: string;
  version?: string;
  language?: string;
};

export type AppListItemType = {
  appName: string;
  comment?: string;
  company?: string;
  icon?: string;
  id: string;
  mainApp?: boolean;
  pkgName?: string;
  platform?: string;
  status?: number;
  tenantId?: string;
  updateTime?: string;
};

export type CdKeyType = {
  assignedNum?: number;
  lastUploadTime?: number;
  orderId?: string;
  totalNum?: number;
};

export type VppTokenType = {
  orgName: string;
  expDate: number;
};

export type AppVersionType = {
  appName?: string;
  appVersionId?: string;
  checksum?: string;
  comment?: string;
  company?: string;
  fileId?: string;
  filePath?: string;
  icon?: string;
  id?: string;
  language?: string;
  largeIcon?: string;
  modelType?: string;
  modelTypes?: string[];
  originalFileName?: string;
  osVersion?: string;
  pkgDownloadUrl?: string;
  pkgName?: string;
  platform?: string;
  publishTime?: string;
  rootPath?: string;
  size?: number;
  smallIcon?: string;
  status?: number;
  tenantId?: string;
  totalDownload?: string;
  updateTime?: string;
  uploadTime?: string;
  version?: string;
  versionStatus?: number;
};

export type InvitationRecordType = {
  id?: string;
  tenantId?: string;
  receiver?: string;
  inviter?: string;
  status?: number;
  createTime?: number;
  channel?: string;
};

export type cdkeyItemType = {
  adamId: string;
  cdkey: string;
  createTime: number;
  id: string;
  loginId: string;
  orderId: string;
  status: number;
  tenantId: string;
  updateTime: number;
  vppAppId: string;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type configKeyType = {
  configKey?: string;
  configValue?: string;
};

export type configKeyValueType = {
  verifyConf?: verifyConfType;
};

export type verifyConfType = {
  type?: string;
  extractConf?: extractConfType;
};

export type extractConfType = {
  logoUrl?: string;
  bgUrl?: string;
  curColor?: string;
  title?: string;
  validationTip?: string;
  tip?: string;
  tip_en?: string;
  title_en?: string;
  validationTip_en?: string;
  code?: string;
  type?: string;
};
