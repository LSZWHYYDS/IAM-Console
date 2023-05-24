import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';
const { REACT_APP_ENV, zwh_test } = process.env;
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const prodGzipList = ['js', 'css'];

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: false,
    immer: true,
  },
  // 单独为本机电脑配置 若打开此属性 本机电脑热更新搭配ahooks导致浏览器卡死
  fastRefresh: zwh_test == 'spp' ? false : {},
  layout: {
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: false,
  },
  //不要修改，否则调试看不到原始代码
  devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false,
  targets: {
    ie: 11,
  },
  routes,
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  base: '/uc/',
  publicPath: '/uc/',
  // openAPI: [
  //   {
  //     requestLibPath: "import { request } from 'umi'",
  //     schemaPath: join(__dirname, 'oneapi.json'),
  //     mock: false,
  //     projectName: 'TotalInterface'
  //   },
  // ],
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  nodeModulesTransform: { type: 'none' },
  request: {
    dataField: '',
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
  chainWebpack(config) {
    if (process.env.NODE_ENV === 'production') {
      // 生产模式开启
      config.plugin('compression-webpack-plugin').use(
        new CompressionWebpackPlugin({
          algorithm: 'gzip',
          test: new RegExp('\\.(' + prodGzipList.join('|') + ')$'), // 匹配哪些格式文件需要压缩
          threshold: 10240,
          minRatio: 0.6,
        }),
      );
    }
  },
});
