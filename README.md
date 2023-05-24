### 此项目是拆分后的管理平台（不包括 login 登录、个人门户）

目前阶段尚未对接 SSO 单点登录，从 446 获取 Authorization Bearea ${ access_token } 中的 `access_token` 添加到开发路径后边。

本地运行：

```
yarn start
```

然后访问：

```
http://localhost:8800/?access_token=99e4e8f8-6298-4ab4-9d63-8bd1cf43b7e4
```

---

### To-do-list:

- [ ] 用户中心
  - [x] 用户管理
    - [x] 用户列表
    - [x] 组织架构列表
    - [x] 使用组织架构筛选用户
    - [x] 搜索用户
    - [x] 新增/编辑用户
    - [x] 启用/禁用 用户
    - [x] 删除用户
    - [x] 导出用户
    - [x] 重新邀请用户
  - [ ] 通讯录集成
    - [x] 通讯录列表
    - [ ] 添加/编辑链接器
      - [ ] AD/LDAP
      - [ ] ETL
      - [ ] 钉钉
    - [ ] 启用/禁用链接器
    - [ ] 删除链接器
  - [ ] 通讯录同步
    - [x] 链接器列表
    - [ ] 添加/编辑链接器
    - [ ] 启用/禁用链接器
    - [ ] 删除链接器
- [ ] 应用中心
  - [ ] 应用管理
    - [x] 应用列表
    - [ ] 编辑应用
      - [x] 应用详情
      - [ ] 单点配置
      - [x] 网关设置
      - [x] 授权范围设置
    - [ ] 新建应用
  - [x] ABM 应用分发
    - [x] 应用信息展示
    - [x] 授权管理
      - [x] 导入授权码
      - [x] 导出授权码
    - [x] 切换默认应用
    - [x] 查看兑换码列表
    - [x] 刷新 managed 授权码
  - [x] 企业应用分发
    - [x] 应用列表
    - [x] 上传应用
    - [x] 上下架应用
    - [x] 删除应用版本
    - [x] 编辑应用信息
  - [x] 分发用户邀请
    - [x] 短信邀请
    - [x] 邮件邀请
    - [x] 发送记录
  - [x] 分发页面定制
    - [x] 分发页面编辑
    - [x] 分发用户端页面
- [x] 设备中心
  - [x] 设备列表
  - [x] 查看设备信息
  - [x] 清除应用数据
- [ ] 权限中心
  - [ ] 管理员账号
    - [x] 管理员列表
    - [x] 搜索并添加管理员
    - [x] 删除管理员
    - [ ] 自定义角色
  - [ ] 管理员角色
    - [x] 角色列表
    - [ ] 新增/编辑角色
    - [ ] 拷贝角色
    - [ ] 删除角色
    - [x] 分配管理员
- [ ] 系统层级
  - [ ] 登录
  - [ ] SSO 登录跳转
  - [ ] 修改密码 admin Digitalsee@2021

interface ResponseData<T = any> { code: number result: T message: string }

// const checkRequirdDataHoc = (checkFunc, placeholderElement) => WrappedFunction => props => { // if (typeof checkFunc === 'function' && checkFunc(props)) { // return <WrappedFunction {...props} />; // } // return placeholderElement || null; // }; Lodash.mergeWith(this.person,apiValue,(localData,apiData)=> apiData===null?localData:undefined
