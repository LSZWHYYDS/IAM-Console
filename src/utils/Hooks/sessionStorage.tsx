import { parseQueryString } from '@/utils/common.utils';
import { history } from 'umi';

export const storageClientID = () => {
  const obj: any = parseQueryString(window.location.href);
  if (obj.continue) {
    history.replace('/user/login' + window.location.search);
    for (const item in obj) {
      if (obj.hasOwnProperty(item)) {
        sessionStorage.setItem(item, obj[item] || '');
      }
    }
  }
};
