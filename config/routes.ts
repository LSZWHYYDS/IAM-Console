const allPath = [
  {
    name: 'users',
    icon: 'icon-user',
    path: '/users',
    routes: [
      {
        path: '/users',
        redirect: '/users/users',
      },
      {
        name: 'management',
        path: '/users/users',
        component: './UserCenter/UserManagement',
      },
      {
        name: 'userTag',
        path: '/users/userTag',
        component: './UserCenter/Tag/TagList',
      },
      {
        name: 'userExtendAttr',
        path: '/users/userExtendAttr',
        component: './EditSetting/Userfield',
        hideInMenu: true,
      },
      {
        name: 'editTagDynamic',
        path: '/users/userTag/editDynamic',
        component: './UserCenter/Tag/EditTagDynamic',
        hideInMenu: true,
      },
      {
        name: 'editTag',
        path: '/users/userTag/edit',
        component: './UserCenter/Tag/EditTag',
        hideInMenu: true,
      },
      {
        name: 'add',
        path: '/users/add',
        component: './UserCenter/UserManagement/CreateOrEdit',
        hideInMenu: true,
      },
      {
        name: 'profile',
        path: '/users/usersDetail',
        component: './UserCenter/UserManagement/UserProfile',
        hideInMenu: true,
      },
      {
        name: 'edit',
        path: '/users/edit',
        component: './UserCenter/UserManagement/CreateOrEdit',
        hideInMenu: true,
      },
      {
        name: 'edit',
        path: '/users/selfEdit',
        component: './UserCenter/UserManagement/CreateOrEdit',
        hideInMenu: true,
      },
      {
        name: 'linker',
        path: '/users/linker',
        component: './UserCenter/Linker',
      },
      {
        name: 'linker.add',
        path: '/users/linker/add',
        component: './UserCenter/Linker/CreateOrEdit',
        hideInMenu: true,
      },
      {
        name: 'linker.edit',
        path: '/users/linker/linkerDetail',
        component: './UserCenter/Linker/CreateOrEdit',
        hideInMenu: true,
      },
      {
        name: 'syncgene',
        path: '/users/syncgene',
        component: './UserCenter/SyncGene',
      },
      // todo**********************************************
      {
        name: 'syncgene.addScim',
        path: '/users/syncgene/add',
        component: './UserCenter/Linker/CreateOrEdit',
        hideInMenu: true,
      },

      {
        name: 'syncgene.addDingding',
        path: '/users/syncgene/addDingding',
        component: './UserCenter/SyncGene/CreateOrEditDingding',
        hideInMenu: true,
      },
      {
        name: 'syncgene.editDingding',
        path: '/users/syncgene/syncgeneDetailDingding',
        component: './UserCenter/SyncGene/CreateOrEditDingding',
        hideInMenu: true,
      },
      {
        name: 'syncgene.addLdap',
        path: '/users/syncgene/addLdap',
        component: './UserCenter/LadpService',
        hideInMenu: true,
      },
      {
        name: 'syncgene.editLdap',
        path: '/users/syncgene/syncgeneDetailLdap',
        component: './UserCenter/LadpService',
        hideInMenu: true,
      },
      {
        name: 'syncgene.addScim',
        path: '/users/syncgene/addScim',
        component: './UserCenter/SyncGene/Scim',
        hideInMenu: true,
      },
      {
        name: 'syncgene.editScim',
        path: '/users/syncgene/syncgeneDetailScim',
        component: './UserCenter/SyncGene/Scim',
        hideInMenu: true,
      },
      {
        name: 'expireUser',
        path: '/users/expireUser',
        layout: false,
        component: './UserCenter/ExpireUser',
        hideInMenu: true,
      },
      {
        name: 'expireUserDetail',
        path: '/users/expireUserDetail',
        layout: false,
        component: './UserCenter/ExpireUserDetail',
        hideInMenu: true,
      },
      {
        name: 'importResult',
        path: '/users/importResult',
        layout: false,
        component: './UserCenter/UserManagement/ImportResult',
        hideInMenu: true,
      },
      {
        name: 'edit',
        path: '/users/users/:username/edit',
        component: './UserCenter/UserManagement/CreateOrEdit',
        hideInMenu: true,
      },
      {
        name: 'profileConfig',
        path: '/users/profileConfig',
        component: './UserCenter/ProfileConfig',
      },
      {
        name: 'profileConfig.detail',
        path: '/users/profileConfig/detail',
        component: './UserCenter/ProfileConfig/CreateOrEdit',
        hideInMenu: true,
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'app',
    icon: 'icon-app',
    path: '/apps',
    routes: [
      {
        path: '/apps',
        redirect: '/apps/list',
      },
      {
        name: 'list',
        path: '/apps/list',
        component: './AppCenter/AppList',
      },
      {
        name: 'list.view',
        path: '/apps/appDetail',
        component: './AppCenter/AppList/AppDetails',
        hideInMenu: true,
      },
      {
        name: 'list.edit',
        path: '/apps/list/appEdit',
        component: './AppCenter/AppList/EditApp',
        hideInMenu: true,
      },
      {
        name: 'list.add',
        path: '/apps/appAdd',
        component: './AppCenter/AppList/EditApp',
        hideInMenu: true,
      },
      {
        name: 'list.market',
        path: '/apps/applicMaket',
        component: './AppCenter/AppMarket',
        hideInMenu: true,
      },
      // todo
      {
        name: 'list.market',
        path: '/apps/cloundandsky',
        component: './AppCenter/AppMarket/CloudAndSky',
        hideInMenu: true,
      },
      {
        name: 'list.Details',
        path: '/apps/applicMaket/applicDetails',
        component: './AppCenter/AppMarket/ApplicationDetails/index',
        hideInMenu: true,
      },
      {
        name: 'list.Configuration',
        path: '/apps/applicMaket/applicConfig',
        component: './AppCenter/AppMarket/AppConfig',
        hideInMenu: true,
      },
      {
        name: 'abmapps',
        path: '/apps/abmapps',
        component: './AppCenter/AbmApps',
      },
      {
        name: 'entapps',
        path: '/apps/entapps',
        component: './AppCenter/EnterpriseApps',
      },
      {
        name: 'corpcertsource',
        path: '/apps/corpcertsource',
        component: './CorpCertSource',
      },
      {
        name: 'corpcertsource.add',
        path: '/apps/corpcertsource/add',
        component: './CorpCertSource/CreateOrEdit',
        hideInMenu: true,
      },
      {
        name: 'corpcertsource.edit',
        path: '/apps/corpcertsource/detail',
        component: './CorpCertSource/CreateOrEdit',
        hideInMenu: true,
      },
      // 创建分类
      {
        name: 'createClassification',
        path: '/apps/createClassification',
        component: './AppCenter/Classification',
        hideInMenu: true,
      },
      /**
       * 为了测试应用市场的组件 后期会后很多NCC 金蝶应用
       */
      {
        name: 'TemplateConfig',
        path: '/apps/TemplateConfig',
        component: './TemplateConfig',
        hideInMenu: true,
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'devices',
    icon: 'icon-device',
    path: '/devices',
    routes: [
      {
        path: '/devices',
        redirect: '/devices/list',
      },
      {
        name: 'list',
        path: '/devices/list',
        component: './DevicesCenter/DevicesList',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'nofunc',
    path: '/nofunc',
    hideInMenu: true,
    component: './noFunc',
  },
  {
    name: 'policy',
    icon: 'icon-policy',
    path: '/policy',
    routes: [
      {
        path: '/policy',
        redirect: '/policy/appPolicy',
      },
      {
        name: 'appPolicy',
        path: '/policy/appPolicy',
        component: './PolicyCenter/index',
      },
      {
        name: 'appPolicy.editPolicy',
        path: '/policy/appPolicy/editPolicy',
        component: './PolicyCenter/EditAppPolicy/index',
        hideInMenu: true,
      },
      {
        name: 'deviceAdmitPolicy.editPolicy',
        path: '/policy/deviceAdmitPolicy/editPolicy',
        component: './PolicyCenter/EditDevicePolicy/index',
        hideInMenu: true,
      },
      {
        name: 'deviceAdmitPolicy',
        path: '/policy/deviceAdmitPolicy',
        component: './PolicyCenter/index',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'link',
    icon: 'icon-connect',
    path: '/link',
    routes: [
      {
        path: '/link',
        redirect: '/link/manage',
      },
      {
        name: 'linkManage',
        path: '/link/manage',
        component: './Link/Manage/index',
      },
      {
        name: 'linkManage.add',
        path: '/link/manage/add',
        component: './Link/Manage/CreateOrEdit/index',
        hideInMenu: true,
      },
      {
        name: 'linkManage.edit',
        path: '/link/manage/edit',
        component: './Link/Manage/CreateOrEdit/index',
        hideInMenu: true,
      },
      {
        name: 'linkManage.event.add',
        path: '/link/manage/eventAdd',
        component: './Link/Manage/CreateOrEdit/EventList/EventDetail',
        hideInMenu: true,
      },
      {
        name: 'linkManage.event.edit',
        path: '/link/manage/eventEdit',
        component: './Link/Manage/CreateOrEdit/EventList/EventDetail',
        hideInMenu: true,
      },
      {
        name: 'linkManage.action.add',
        path: '/link/manage/actionAdd',
        component: './Link/Manage/CreateOrEdit/ActionList/ActionDetail',
        hideInMenu: true,
      },
      {
        name: 'linkManage.action.edit',
        path: '/link/manage/actionEdit',
        component: './Link/Manage/CreateOrEdit/ActionList/ActionDetail',
        hideInMenu: true,
      },
      {
        name: 'linkFlow',
        path: '/link/flow',
        component: './Link/Flow/index',
      },
      {
        name: 'linkFlow.editFlow',
        path: '/link/flow/editflow',
        component: './Link/Flow/RouterComponent/editFlow',
        hideInMenu: true,
      },
      {
        name: 'linkFlow.flowComp',
        path: '/link/flow/flowComp',
        component: './Link/Flow/RouterComponent/FlowComp',
        hideInMenu: true,
      },
      // }
      // {
      //   name: 'syncgene',
      //   path: '/users/syncgene',
      //   component: './UserCenter/SyncGene',
      // },
      // {
      //   name: 'syncgene.addDingding',
      //   path: '/users/syncgene/addDingding',
      //   component: './UserCenter/SyncGene/CreateOrEditDingding',
      //   hideInMenu: true,
      // },

      {
        component: './404',
      },
    ],
  },
  {
    name: 'newsList',
    icon: 'icon-msg',
    path: '/newsList',
    routes: [
      {
        path: '/newsList',
        redirect: '/newsList/newsList',
      },
      {
        name: 'newsList',
        path: '/newsList/newsList',
        component: './NewsList',
      },
      {
        name: 'newsDetail',
        path: '/newsList/newsList/newsDetail',
        component: './NewsList/NewsDetail',
        hideInMenu: true,
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'log',
    icon: 'icon-app',
    path: '/log',
    routes: [
      {
        path: '/log',
        redirect: '/log/loginLog',
      },
      {
        name: 'loginLog',
        path: '/log/loginLog',
        component: './LogAudit/LoginLog',
      },
      {
        name: 'systemLog',
        path: '/log/systemLog',
        component: './LogAudit/SystemLog',
      },
      {
        name: 'fileAuditLog',
        path: '/log/fileAuditLog',
        component: './FileAuditLog',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'permissions',
    icon: 'icon-auth',
    path: '/permissions',
    routes: [
      {
        path: '/permissions',
        redirect: '/permissions/users',
      },
      {
        name: 'users',
        path: '/permissions/users',
        component: './Permissions/Users',
      },
      {
        name: 'usersDetail',
        path: '/permissions/users/detail',
        component: './UserCenter/UserManagement/UserProfile',
        hideInMenu: true,
      },
      {
        name: 'roles',
        path: '/permissions/roles',
        component: './Permissions/Roles',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'setting',
    icon: 'icon-ic_parameter',
    path: '/setting',
    routes: [
      {
        path: '/setting',
        redirect: '/setting/editSetting',
      },
      {
        name: 'editSetting',
        path: '/setting/editSetting',
        component: './EditSetting/index',
      },
      {
        name: 'corpcert',
        path: '/setting/corpcert',
        component: './CorpCert',
      },
      {
        name: 'templates',
        path: '/setting/templates',
        component: './MsgTemplate/index',
      },
      {
        name: 'licencePage',
        path: '/setting/licencePage',
        component: './LicencePage/index',
      },

      {
        name: 'invitations',
        path: '/setting/invitations',
        component: './AppCenter/AppInvitations',
      },
      {
        name: 'customize',
        path: '/setting/customize',
        component: './AppCenter/CustomizeSettings',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/blankPage',
    component: './MiddlePage',
    layout: false,
  },
  {
    component: './404',
  },
];

export default allPath;
