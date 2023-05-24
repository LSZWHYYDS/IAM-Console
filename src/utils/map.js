import defaultCli from '@/../public/images/cli.png';
import defaultNative from '@/../public/images/native.png';
import defaultTrusted from '@/../public/images/trusted.png';
import defaultWeb from '@/../public/images/web.png';
import defaultSpa from '@/../public/images/spa.png';
import defaultApp from '@/../public/images/default-app-icon.png';

export const app = {
  getAppType(appType) {
    const map = {
      ALL: '全部',
      NATIVE: 'Native App',
      TRUSTED: 'Trusted App',
      SPA: 'Single Page App',
      WEB: 'Web App',
      CLI: 'CLI App',
    };
    return map[appType && appType.toUpperCase()] || '--';
  },
  getAppSrc(appSrc) {
    const map = {
      DINGDING: '钉钉同步',
    };
    return map[appSrc && appSrc.toUpperCase()] || '--';
  },
  getAppStatus(status) {
    const map = {
      1: '启用',
      0: '禁用',
    };
    return map[status] || '--';
  },
  getStatus(status) {
    const map = {
      ALL: '全部',
      ACTIVE: '启用',
      INACTIVE: '禁用',
    };
    return map[status && status.toUpperCase()] || '--';
  },
  getDefaultAppIcon(appType) {
    const map = {
      NATIVE: defaultNative,
      TRUSTED: defaultTrusted,
      CLI: defaultCli,
      WEB: defaultWeb,
      SPA: defaultSpa,
    };
    return map[appType && appType.toUpperCase()] || defaultApp;
  },
  getCheckboxStatus(enabled) {
    return enabled ? '启用' : '禁用';
  },
};
