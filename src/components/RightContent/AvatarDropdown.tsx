// import { outLogin } from '@/services/ant-design-pro/api';
import { logout } from '@/pages/Account/service';
import ResetPasswordForm from '@/pages/UserCenter/UserManagement/ResetPasswordForm/index';
import { clearLoginStorage } from '@/utils/common.utils';
import { LogoutOutlined, SettingOutlined, UserOutlined, PicLeftOutlined } from '@ant-design/icons';
import { Avatar, Modal, Spin } from 'antd';
// import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { Fragment, useCallback, useState } from 'react';
import { history, useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
// import conf from '@/utils/conf';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = () => {
  try {
    const tcode = sessionStorage.getItem('tcode');
    clearLoginStorage();
    logout(location.origin + `/?tcode=${tcode}`);
  } catch (e) {}
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [pwdFormVisible, setPwdFormVisible] = useState(false);

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
        loginOut();
        return;
      } else if (key === 'resetPassword') {
        setPwdFormVisible(true);
        return;
      } else if (key == 'person') {
        const tcode = sessionStorage.getItem('tcode');
        sessionStorage.clear();
        location.href = `${location.origin}/portal/?tcode=${tcode}`;
        return;
      } else if (key === 'userEdit') {
        //   const permMenus = JSON.parse(sessionStorage.getItem('permMenus'));
        history.push({
          pathname: `/users/selfEdit`,
        });
      } else history.push(`/user/${key}`);
    },
    [setInitialState],
  );

  const onClosePwdForm = () => {
    setPwdFormVisible(false);
  };

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.tenant_id) {
    return loading;
  }
  const items = [
    {
      key: 'userEdit',
      label: (
        <>
          <UserOutlined style={{ marginRight: 10 }} />
          个人中心
        </>
      ),
    },
    {
      key: 'resetPassword',
      label: (
        <>
          <SettingOutlined style={{ marginRight: 10 }} />
          修改密码
        </>
      ),
    },
    {
      key: 'person',
      label: (
        <>
          <PicLeftOutlined style={{ marginRight: 10 }} />
          工作台
        </>
      ),
    },
    {
      key: 'logout',
      label: (
        <>
          <LogoutOutlined style={{ marginRight: 10 }} />
          退出登录
        </>
      ),
    },
  ];
  const resetItems = items.filter((is) => {
    if (currentUser.username == 'admin' && is.key == 'person') {
      return false;
    } else {
      return true;
    }
  });

  return (
    <Fragment>
      <Modal
        open={pwdFormVisible}
        width={600}
        footer={null}
        destroyOnClose
        onCancel={onClosePwdForm}
      >
        <ResetPasswordForm
          username={currentUser.name || currentUser.username}
          inDlg={true}
          onClose={onClosePwdForm}
        />
      </Modal>
      <HeaderDropdown menu={{ items: resetItems, selectedKeys: [], onClick: onMenuClick }}>
        <span className={`${styles.action} ${styles.account}`} style={{ minWidth: 90 }}>
          <Avatar size="small" className={styles.avatar} src={currentUser.picture} alt="avatar" />
          <span className={`${styles.name} anticon`}>
            {currentUser.name || currentUser.username}
          </span>
        </span>
      </HeaderDropdown>
    </Fragment>
  );
};

export default AvatarDropdown;
