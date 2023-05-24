import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import * as WebAuth from '@/utils/webAuth';
import staticMethod from '@/utils/staticMethod';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { notification } from 'antd';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { history, Link, RequestConfig, RunTimeLayoutConfig } from 'umi';
import { handleHaveToken, handleNotPermissions, handleShowNofunc } from './utils/Hooks/UserInfo';
import { handleHome } from './utils/Hooks/handleHome';

export const initialStateConfig = {
  loading: <PageLoading />,
};
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: DIGITALSEE.CurrentUser;
  licData?: DIGITALSEE.LicData;
  fetchUserInfo?: () => Promise<DIGITALSEE.CurrentUser | undefined>;
  fetchTenantLicense?: () => Promise<DIGITALSEE.LicData | undefined>;
  getPolicyData?: () => any;
  policyData?: any;
}> {
  /**
   * 如果访问是不需要鉴权的页面 则直接访问
   */
  if (WebAuth.isAuthed()) return {};
  const query: any = staticMethod.parseQueryString(window.location.href);
  const access_token: any = query && query?.access_token;
  const lastToken = sessionStorage.getItem('access_token');
  if (access_token) {
    if (!WebAuth.ThereAreAccessToken()) return {};
  } else {
    if (!lastToken) {
      WebAuth.startInitAuth();
      return {};
    }
  }
  // 判断有token并且是管理平台的首页则执行这段代码
  if (sessionStorage.getItem('access_token')) {
    const promiseObj: any = handleHaveToken();
    return promiseObj;
  }
  return {};
}

export const layout: RunTimeLayoutConfig = ({ initialState }: { initialState: any }) => {
  const userInfo = initialState?.currentUser;
  return {
    logo: (
      <img
        src={
          initialState?.policyData?.uc_logo
            ? initialState?.policyData?.uc_logo
            : '/uc/images/logo.png'
        }
      />
    ),
    // title: initialState?.policyData?.uc_name || '云身份连接器-数犀科技',
    title: initialState?.policyData?.uc_name,
    disableContentMargin: false,
    rightContentRender: () => <RightContent />,
    footerRender: () => <Footer />,
    onPageChange: () => {
      //  处理没有权限
      if (handleNotPermissions(userInfo)) {
        history.push('/blankPage');
        return;
      } else {
        // 处理首页pathname为/uc 则自动跳转/uc/users/users
        if (handleHome()) return;
        // 处理跳转到未购买页面
        if (handleShowNofunc()) return;
      }
    },
    itemRender: (router, params, routers) => {
      if (WebAuth.handleBreadcrumb(router, params, routers)) {
        return (
          <Link to={router.path + location.search}>
            {WebAuth.handleBreadcrumb(router, params, routers)}
          </Link>
        );
      } else {
        return <Link to={router.path + location.search}>{router.breadcrumbName}</Link>;
      }
    },
    menuDataRender: (menuData) => (initialState && initialState.menuData) || menuData || [],
    //  menuDataRender: (menuData) => {
    //    return (
    //      (initialState && initialState.status === 'ACTIVE' && initialState.menuData) ||
    //      menuData ||
    //      []
    //    );
    //  },
  };
};

export const request: RequestConfig = {
  // timeout: 10,
  // timeoutMessage: '',
  errorHandler: (error: any) => {
    const { response } = error;
    if (!response) {
      notification.error({
        description: '您的网络发生异常，无法连接服务器',
        message: '网络异常',
      });
    }
    throw error;
  },
};
