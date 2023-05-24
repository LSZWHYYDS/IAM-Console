export const menuList = [
  {
    title: '用户中心',
    key: '/users',
    children: [
      {
        title: '用户管理',
        key: '/users/users',
        children: [
          {
            title: '查看用户',
            key: 'VIEW_USER',
            type: 'func',
          },
        ],
      },
      {
        title: '用户标签',
        key: '/users/userTag',
        children: [
          {
            title: '查看用户标签',
            key: 'VIEW_USERTAG',
            type: 'func',
          },
        ],
      },
      {
        title: '通讯录集成',
        key: '/users/linker',
        children: [
          {
            title: '查看链接器',
            key: 'VIEW_DATASOURCE',
            type: 'func',
          },
          {
            title: '编辑链接器',
            key: 'EDIT_DATASOURCE',
            type: 'func',
          },
          {
            title: '新建链接器',
            key: 'NEW_DATASOURCE',
            type: 'func',
          },
        ],
      },
      {
        title: '通讯录同步',
        key: '/users/syncgene',
        children: [
          {
            title: '查看通讯录链接器',
            key: 'VIEW_PUSH_CONNECTOR',
            type: 'func',
          },
          {
            title: '更新通讯录同步链接器',
            key: 'EDIT_PUSH_CONNECTOR',
            type: 'func',
          },
          {
            title: '新建通讯录同步链接器',
            key: 'NEW_PUSH_CONNECTOR',
            type: 'func',
          },
        ],
      },
      {
        title: '用户属性管理',
        key: '/users/profileConfig',
        children: [
          {
            title: '用户属性管理',
            key: 'VIEW_APP_PROFILE',
            type: 'func',
          },
        ],
      },
      // {
      //   title: 'LDAP服务',
      //   key: '/uc/ladpService',
      //   children: [
      //     {
      //       title: '查看LadpService',
      //       key: 'VIEW_LDAPSERVICE',
      //       type: 'func',
      //     },
      //   ],
      // },
    ],
  },
  {
    title: '应用管理',
    key: '/apps',
    children: [
      {
        title: '应用',
        key: '/apps/list',
        children: [
          {
            title: '查看应用',
            key: 'VIEW_APP',
            type: 'func',
          },
          {
            title: '删除应用',
            key: 'DELETE_APP',
            type: 'func',
          },
          {
            title: '编辑应用',
            key: 'EDIT_APP',
            type: 'func',
          },
          {
            title: '新建应用',
            key: 'NEW_APP',
            type: 'func',
          },
          {
            title: '授权应用',
            key: 'ENTITLE_APP',
            type: 'func',
          },
        ],
      },
      {
        title: 'ABM 应用分发',
        key: '/apps/abmapps',
        children: [
          {
            title: 'ABM 应用分发管理',
            key: 'MANAGE_ABMAPP',
            type: 'func',
          },
        ],
      },
      {
        title: '企业应用分发',
        key: '/apps/entapps',
        children: [
          {
            title: '管理',
            key: 'MANAGE_ENTAPP',
            type: 'func',
          },
        ],
      },
    ],
  },

  {
    title: '设备中心',
    key: '/devices',
    children: [
      {
        title: '设备列表',
        key: '/devices/list',
        children: [
          {
            title: '管理',
            key: 'MANAGE_DEVICE',
            type: 'func',
          },
        ],
      },
    ],
  },
  {
    title: '策略中心',
    key: '/policy',
    children: [
      {
        title: '应用策略',
        key: '/policy/appPolicy',
        children: [
          {
            title: '管理',
            key: 'MANAGE_APPPOLICY',
            type: 'func',
          },
        ],
      },
      {
        title: '设备准入策略',
        key: '/policy/deviceAdmitPolicy',
        children: [
          {
            title: '管理',
            key: 'MANAGE_DEVICEPOLICY',
            type: 'func',
          },
        ],
      },
    ],
  },
  {
    title: '连接中心',
    key: '/links',
    children: [
      {
        title: '连接器',
        key: '/links/manage',
        children: [
          {
            title: '查看',
            key: 'VIEW_LINK',
            type: 'func',
          },
        ],
      },
      {
        title: '连接流',
        key: '/links/flow',
        children: [
          {
            title: '查看',
            key: 'VIEW_FLOW',
            type: 'func',
          },
        ],
      },
    ],
  },
  {
    title: '消息中心',
    key: '/newsList',
    children: [
      {
        title: '推送历史',
        key: '/newsList/newsList',
        children: [
          {
            title: '管理',
            key: 'MANAGE_NEWSLIST',
            type: 'func',
          },
        ],
      },
    ],
  },
  {
    title: '审计日志',
    key: '/log',
    children: [
      {
        title: '登录日志',
        key: '/log/loginLog',
        children: [
          {
            title: '查看',
            key: 'VIEW_LOG_LOGIN',
            type: 'func',
          },
        ],
      },
      {
        title: '系统日志',
        key: '/log/systemLog',
        children: [
          {
            title: '查看',
            key: 'VIEW_LOG_SYSTEM',
            type: 'func',
          },
        ],
      },
      {
        title: '文件审计',
        key: '/fileAudit/fileAuditLog',
        children: [
          {
            title: '查看',
            key: 'VIEW_LOG_FILEAUDIT',
            type: 'func',
          },
        ],
      },
    ],
  },
  {
    title: '参数配置',
    key: '/setting',
    children: [
      {
        title: '系统设置',
        key: '/setting/editSetting',
        children: [
          {
            title: '查看系统设置',
            key: 'VIEW_SYSTEM_SETTINGS',
            type: 'func',
          },
          {
            title: '修改系统设置',
            key: 'EDIT_SYSTEM_SETTINGS',
            type: 'func',
          },
        ],
      },
      {
        title: '授权信息',
        key: '/setting/licencePage',
        children: [
          {
            title: '管理',
            key: 'MANAGE_LIC',
            type: 'func',
          },
        ],
      },
      {
        title: '消息模板',
        key: '/setting/templates',
        children: [
          {
            title: '查看消息模板',
            key: 'VIEW_TEMPLATES',
            type: 'func',
          },
          {
            title: '更新消息模板',
            key: 'EDIT_TEMPLATES',
            type: 'func',
          },
        ],
      },
      {
        title: '分发用户邀请',
        key: '/setting/invitations',
        children: [
          {
            title: '管理',
            key: 'MANAGE_INVITATIONS',
            type: 'func',
          },
        ],
      },
      {
        title: '分发页面定制',
        key: '/setting/customize',
        children: [
          {
            title: '管理',
            key: 'MANAGE_CUSTOMIZE',
            type: 'func',
          },
        ],
      },
      {
        title: '平台集成',
        key: '/setting/corpcert',
        children: [
          {
            title: '查看',
            key: 'VIEW_PLATFORM',
            type: 'func',
          },
        ],
      },
    ],
  },
  {
    title: '权限管理',
    key: '/permissions',
    children: [
      {
        title: '管理员账号',
        key: '/permissions/users',
        children: [
          {
            title: '查看',
            key: 'VIEW_PERM_ADMIN',
            type: 'func',
          },
        ],
      },
      {
        title: '角色管理',
        key: '/permissions/roles',
        children: [
          {
            title: '查看',
            key: 'VIEW_PERM_ROLES',
            type: 'func',
          },
        ],
      },
    ],
  },
];
export const permPaths: string[] = [];

export const allPermPaths: string[] = [];

export const getAllPathsByPermSet = (permissionsSets: string[]) => {
  // 作用把所有的一级对象key和二级路由对象中的的key 添加到所有的权限路由中
  const getPathByPermSet = (menus: any) => {
    // 其次三级路由包含key和type也就是功能路由则 添加到permissionPaths
    if (!menus.children) {
      return;
    }
    if (menus.key && !menus.type) {
      allPermPaths.push(menus.key);
    }
    const menu = menus.children.find((child: any) => {
      return child.type === 'func' && permissionsSets.includes(child.key);
    });
    if (menu) {
      permPaths.push(menus.key);
    } else {
      menus.children.forEach((menuItem: any) => {
        getPathByPermSet(menuItem);
      });
    }
  };
  menuList.forEach((menuItem) => {
    getPathByPermSet(menuItem);
  });
  return { permPaths, allPermPaths };
};
