import { getPolicies } from '@/pages/EditSetting/service';
import { tenantLicense } from '@/pages/LicencePage/service';
import { currentUser as queryCurrentUser } from '../../services/digitalsee/api';
import { getPermMenuData } from '@/utils/configs.utils';
import { setLicData } from '@/utils/common.utils';
import { hasFunc } from '../../utils/common.utils';
import { history } from 'umi';

export const fetchUserInfo = async () => {
  try {
    const msg = await queryCurrentUser();
    return msg.data;
  } catch (error) { }
  return undefined;
};

export const getPolicieData = async () => {
  try {
    const result = await getPolicies();
    return result.data;
  } catch (error) { }
  return undefined;
};

export const fetchTenantLicense = async () => {
  try {
    const msg = await tenantLicense();
    sessionStorage.setItem('licConfig', JSON.stringify(msg.data));
    setLicData(msg.data.license_config);
    return msg.data;
  } catch (error) { }
  return undefined;
};

// 判断有token并且是管理平台的首页则执行这段代码
export const handleHaveToken = async () => {
  const currentUser: any = await fetchUserInfo();
  if (currentUser.tenant_id) {
    sessionStorage.setItem('tcode', currentUser.tenant_id);
  }
  const policyData = await getPolicieData();
  const licData = currentUser && (await fetchTenantLicense());
  sessionStorage.setItem('client_id', 'usercenter');
  sessionStorage.setItem('ucName', policyData?.uc_name);
  sessionStorage.setItem('permMenus', JSON.stringify(currentUser));
  const menuData = getPermMenuData(
    (currentUser && currentUser.permissions_sets) || [],
    currentUser.username || '',
  );
  return {
    fetchUserInfo,
    currentUser,
    menuData,
    licData,
    policyData,
    settings: {},
  };
};

export const handleNotPermissions = (userInfo: any) => {
  if (userInfo && (!userInfo.permissions_sets || !userInfo.permissions_sets.length)) {
    location.href = location.origin + '/portal';
    return true;
  }
  return false;
};

export const handleShowNofunc = () => {
  const basePath = '/uc';
  const path = location.pathname.substring(basePath.length);
  if (!hasFunc(path)) {
    history.replace('/nofunc');
    return true;
  }
  return false;
};
