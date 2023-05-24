// import { storageClientID } from '../Hooks/sessionStorage';
import { permPaths } from '../../../config/menuData';
import { history } from 'umi';

export const handleHome = () => {
  if (location?.pathname === '/' || location?.pathname === '/uc/' || location?.pathname === '/uc') {
    if (permPaths.length) {
      history.replace(permPaths[0] + window.location.search);
    } else if (sessionStorage.getItem('access_token')) {
      history.replace('/users/users' + window.location.search);
    } else {
      history.replace('/blankPage');
    }
    return true;
  }
  return false;
};
