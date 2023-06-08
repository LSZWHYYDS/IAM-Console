/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/api': {
      // target: 'https://192-168-50-17-81c22d0dlfr4.ztna-dingtalk.com',
      target: 'https://192-168-50-24-7nyfs9psvoxs.ztna-dingtalk.com/',
      // target: 'http://192.168.50.17',
      changeOrigin: true,
      secure: false,
      pathRewrite: { '^/api': '' },
    },
    '/iam': {
      secure: false,
      // target: 'https://192-168-50-17-81c22d0dlfr4.ztna-dingtalk.com',
      target: 'https://192-168-50-24-7nyfs9psvoxs.ztna-dingtalk.com/',
      // target: 'http://192.168.50.17',
      changeOrigin: true,
    },
    '/mdm': {
      secure: false,
      // target: 'https://192-168-50-17-81c22d0dlfr4.ztna-dingtalk.com',
      target: 'https://192-168-50-24-7nyfs9psvoxs.ztna-dingtalk.com/',
      // target: 'http://192.168.50.17',
      changeOrigin: true,
    },
    '/adm': {
      secure: false,
      // target: 'https://192-168-50-17-81c22d0dlfr4.ztna-dingtalk.com',
      target: 'https://192-168-50-24-7nyfs9psvoxs.ztna-dingtalk.com/',
      // target: 'http://192.168.50.17',
      changeOrigin: true,
    },
  },
  test: {
    '/api/': {
      target: 'https://192-168-50-17-81c22d0dlfr4.ztna-dingtalk.com',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/iam': {
      secure: false,
      target: 'https://192-168-50-17-81c22d0dlfr4.ztna-dingtalk.com',
      changeOrigin: true,
    },
    '/mdm': {
      secure: false,
      target: 'https://192-168-50-17-81c22d0dlfr4.ztna-dingtalk.com',
      changeOrigin: true,
    },
  },
  pre: {
    '/api/': {
      target: 'https://192-168-50-17-81c22d0dlfr4.ztna-dingtalk.com',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/iam': {
      secure: false,
      target: 'https://192-168-50-17-81c22d0dlfr4.ztna-dingtalk.com',
      changeOrigin: true,
    },
    '/mdm': {
      secure: false,
      target: 'https://192-168-50-17-81c22d0dlfr4.ztna-dingtalk.com',
      changeOrigin: true,
    },
  },
};
