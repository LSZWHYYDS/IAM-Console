/* eslint-disable @typescript-eslint/no-unused-expressions */
import _ from 'lodash';
import { hasFunc } from '@/utils/common.utils';
import allPath from '../../config/routes';
import { getAllPathsByPermSet } from '../../config/menuData';

export const IosVersions = ['7.0', '8.0', '9.0', '10.0', '11.0', '12.0', '13.0', '14.0', '15.0'];
export const AndroidVersions = ['4.0', '5.0', '6.0', '7.0', '8.0', '9.0', '10.0', '11.0', '12.0'];

export const LicenseConfigPath = {
  user_join: ['/users/syncgene', '/setting/corpcert'],
  app_sso: ['/apps/list'],
  risk_monitor: ['/devices/list'],
  file_audit: ['/log/fileAuditLog'],
  adm: [
    '/apps/abmapps',
    '/apps/entapps',
    '/setting/entapps',
    '/setting/invitations',
    '/setting/customize',
  ],
  dlp: ['/policy/appPolicy', '/policy/deviceAdmitPolicy'],
  gateway: [],
};
let allPermPaths: string[] = [];
let hasPermPaths: string[] = [];

export const hasPerm = (path: string) => {
  const needPerm = allPermPaths.includes(path);
  if (!needPerm) {
    return true;
  }
  const hasChild = _.find(hasPermPaths, (item) => {
    return _.startsWith(item, path);
  })?.length;
  return hasPermPaths.includes(path) || hasChild;
};
function removeNoPermMenu(menus: any) {
  menus &&
    _.remove(menus, (menu: any) => {
      const del = !hasPerm(menu.path);
      if (del) {
        return del;
      }
      removeNoPermMenu(menu.routes);
      if (menu.routes && menu.routes.length === 0) {
        return true;
      }
      return false;
    });
}
function removeNoLicMenu(menus: any) {
  menus &&
    _.remove(menus, (menu: any) => {
      const has = hasFunc(menu.path); // 不需要验证权限的路由不进行删除
      if (!has) {
        return true;
      }
      removeNoLicMenu(menu.routes);
      if (menu.routes) {
        const filtered =
          menu.routes.filter((item: any) => {
            return !item.redirect && item.path && item.hideInMenu != true;
          }) || [];
        if (!filtered.length) {
          return true;
        }
      }
      return false;
    });
}
export const getPermMenuData = (permissionsSets: any, loginId: string) => {
  const permMenus = _.cloneDeep(allPath);
  const licConfig = sessionStorage.getItem('licConfig');
  const obj = (licConfig && JSON.parse(licConfig)) || {};
  if (obj && !obj.license_config.show_no_perm_menu) {
    removeNoLicMenu(permMenus);
  }
  if (loginId === 'admin') {
    return permMenus;
  }
  const permInfo = getAllPathsByPermSet(permissionsSets);
  allPermPaths = permInfo.allPermPaths;
  hasPermPaths = permInfo.permPaths;
  removeNoPermMenu(permMenus);
  return permMenus;
};
