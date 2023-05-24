import { history } from 'umi';
export const handlePortal = (isSelf: any, userInfo: any) => {
  if (!isSelf && userInfo) {
    history.replace(`/uc/selfInfo`);
    return true;
  }
  return;
};
export const portalUrl = [
  '/uc/selfInfo',
  '/uc/userapplyforControl',
  '/uc/selfInfo/',
  '/uc/userapplyforControl/',
  '/portal/',
  '/portal',
];
