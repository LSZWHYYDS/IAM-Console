import { Request, Response } from 'express';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

async function getFakeCaptcha(req: Request, res: Response) {
  await waitTime(2000);
  return res.json('captcha-xxx');
}

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;

/**
 * 当前用户的权限，如果为空代表没登录
 * current user access， if is '', user need login
 * 如果是 pro 的预览，默认是有权限的
 */
let access = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site' ? 'admin' : '';

const getAccess = () => {
  return access;
};

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': (req: Request, res: Response) => {
    if (!getAccess()) {
      res.status(401).send({
        data: {
          isLogin: false,
        },
        errorCode: '401',
        errorMessage: '请先登录！',
        success: true,
      });
      return;
    }
    res.send({
      success: true,
      data: {
        name: 'Serati Ma',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        userid: '00000001',
        email: 'antdesign@alipay.com',
        signature: '海纳百川，有容乃大',
        title: '交互专家',
        group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
        tags: [
          {
            key: '0',
            label: '很有想法的',
          },
          {
            key: '1',
            label: '专注设计',
          },
          {
            key: '2',
            label: '辣~',
          },
          {
            key: '3',
            label: '大长腿',
          },
          {
            key: '4',
            label: '川妹子',
          },
          {
            key: '5',
            label: '海纳百川',
          },
        ],
        notifyCount: 12,
        unreadCount: 11,
        country: 'China',
        access: getAccess(),
        geographic: {
          province: {
            label: '浙江省',
            key: '330000',
          },
          city: {
            label: '杭州市',
            key: '330100',
          },
        },
        address: '西湖区工专路 77 号',
        phone: '0752-268888888',
      },
    });
  },
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'POST /api/login/account': async (req: Request, res: Response) => {
    const { password, username, type } = req.body;
    await waitTime(2000);
    if (password === 'ant.design' && username === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      access = 'admin';
      return;
    }
    if (password === 'ant.design' && username === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      access = 'user';
      return;
    }
    if (type === 'mobile') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      access = 'admin';
      return;
    }

    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
    access = 'guest';
  },
  'POST /iam/api/login/logout': (req: Request, res: Response) => {
    access = '';
    res.send({ data: {}, success: true });
  },
  'POST /api/register': (req: Request, res: Response) => {
    res.send({ status: 'ok', currentAuthority: 'user', success: true });
  },
  'GET /api/500': (req: Request, res: Response) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req: Request, res: Response) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req: Request, res: Response) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req: Request, res: Response) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET  /api/login/captcha': getFakeCaptcha,
  'POST /api/applicationMarket': (req: Request, res: Response) => {
    res.send({
      success: true,
      data: [
        {
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
          title: '交互专家',
          details:
            '继唐诗、宋词之后蔚为一文学之盛的元曲有着它独特的魅力：一方面，元曲继承了诗词的清丽婉转；一方面，元代社会使读书人位于“八娼九儒十丐”的地位，政治专权，社会黑暗，因而使元曲放射出极为夺目的战斗的光彩，透出反抗的情绪；锋芒直指社会弊端，直斥“不读书最高，不识字最好，不晓事倒有人夸俏”的社会，直指“人皆嫌命窘，谁不见钱亲”的世风。元曲中描写爱情的作品也比历代诗词来得泼辣，大胆。这些均足以使元曲永葆其艺术魅力。',
          applicationClass: ['分类一', '分类二'],
          developers: '数犀科技有限公司',
          inteag: ['OIDC', 'SAML', 'https'],
          appAddres: 'http://www.baidu.com',
        },
        {
          avatar:
            'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg9.51tietu.net%2Fpic%2F2019-091200%2Fnobjxcvlhu0nobjxcvlhu0.jpg&refer=http%3A%2F%2Fimg9.51tietu.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660904849&t=8dbeddf6539ceb07f363618a976cfff4',
          title: 'Bootstarp',
          details:
            'Bootstrap 优站精选频道收集了众多基于 Bootstrap 构建、设计精美的、有创意的网站。',
          applicationClass: ['娱乐', '运动', '学习'],
          developers: '名利科技有限公司',
          inteag: ['OIDC', 'SAML', 'https'],
          appAddres: 'http://www.baidu.com',
        },
        {
          avatar:
            'https://fastly.jsdelivr.net/npm/@bootcss/www.bootcss.com@0.0.62/dist/img/react.png',
          title: 'React',
          details:
            '用于构建用户界面的 JavaScript 框架React 起源于 Facebook 的内部项目，是一个用于构建用户界面的 JavaScript 库。',
          applicationClass: ['健身', '跑步', '音乐'],
          developers: '华尔科技有限公司',
          inteag: ['OIDC', 'SAML'],
          appAddres: 'http://www.baidu.com',
        },
        {
          avatar:
            'https://fastly.jsdelivr.net/npm/@bootcss/www.bootcss.com@0.0.62/dist/img/webpack.png',
          title: 'Webpack',
          details:
            '是前端资源模块化管理和打包工具Webpack 是当下最热门的前端资源模块化管理和打包工具。它可以将许多松散的模块按照依赖和规则打包成符合生产环境部署的前端资源。',
          applicationClass: ['读书', '跑步'],
          developers: 'KLSE科技有限公司',
          inteag: ['OIDC', 'SAML'],
          appAddres: 'http://www.baidu.com',
        },
        {
          avatar:
            'https://fastly.jsdelivr.net/npm/@bootcss/www.bootcss.com@0.0.62/dist/img/typescript.png',
          title: 'TypeScript',
          details:
            'TypeScript 是由微软开源的编程语言。它是 JavaScript 的一个超集，而且本质上向这个语言添加了可选的静态类型和基于类的面向对象编程。',
          applicationClass: ['应用一', '分类一'],
          developers: 'FOPMI科技有限公司',
          inteag: ['SAML'],
          appAddres: 'http://www.baidu.com',
        },
        {
          avatar:
            'https://fastly.jsdelivr.net/npm/@bootcss/www.bootcss.com@0.0.62/dist/img/babeljs.png',
          title: 'Babel',
          details:
            '是一个 JavaScript 编译器。Babel 是一个 JavaScript 编译器。Babel 通过语法转换器支持最新版本的 JavaScript 语法。',
          applicationClass: ['APP应用', 'PC应用'],
          developers: '友善科技有限公司',
          inteag: ['SAML', 'http'],
          appAddres: 'http://www.baidu.com',
        },
        {
          avatar:
            'https://fastly.jsdelivr.net/npm/@bootcss/www.bootcss.com@0.0.62/dist/img/tailwindcss.png',
          title: 'Tailwind CSS',
          details:
            'Tailwind CSS 是一个用于快速UI开发的实用工具集 CSS 框架。与 Bootstrap 、Foundation 不同，Tailwind CSS 没有内置的 UI 组件。完全需要开发者根据自身情况来定制设',
          applicationClass: ['协同', '开发'],
          developers: 'SDF科技有限公司',
          inteag: ['SAML', 'http'],
          appAddres: 'http://www.baidu.com',
        },
        {
          avatar:
            'https://fastly.jsdelivr.net/npm/@bootcss/www.bootcss.com@0.0.62/dist/img/alpinejs.png',
          title: 'Alpine.js',
          details:
            '中文文档Alpine.js 通过很低的成本提供了与 Vue 或 React 这类大型框架相近的响应式和声明式特性。Alpine.js 的语法几乎完全借用自 Vue。',
          applicationClass: ['多人', '慈善'],
          developers: 'JKF科技有限公司',
          inteag: ['SAML', 'http'],
          appAddres: 'http://www.baidu.com',
        },
        {
          avatar:
            'https://fastly.jsdelivr.net/npm/@bootcss/www.bootcss.com@0.0.62/dist/img/docusaurus.png',
          title: 'Docusaurus',
          details:
            '基于 React 框架的静态站点生成器Docusaurus 是一款基于 React 框架构建的易于维护的静态网站创建工具。Docusaurus 能够帮你快速建立文档网站、博客、营销页面等。',
          applicationClass: ['财务', 'ERP', 'KDP'],
          developers: 'kfc科技有限公司',
          inteag: ['SAML', 'http'],
          appAddres: 'http://www.baidu.com',
        },
        {
          avatar:
            'https://fastly.jsdelivr.net/npm/@bootcss/www.bootcss.com@0.0.62/dist/img/recoil.png',
          title: 'Recoil',
          details:
            'React 状态管理库Recoil 是一个针对 React 应用程序的状态管理库。 它提供了仅使用 React 难以实现的几种功能，同时与 React 的最新功能兼容。',
          applicationClass: ['税务', '安全'],
          developers: 'RFG科技有限公司',
          inteag: ['SAML', 'http'],
          appAddres: 'http://www.baidu.com',
        },
        {
          avatar:
            'https://fastly.jsdelivr.net/npm/@bootcss/www.bootcss.com@0.0.62/dist/img/lodash.png',
          title: 'Lodash',
          details:
            'JavaScript 工具库Lodash 是一个具有一致接口、模块化、高性能等特性的 JavaScript 工具库。比相同功能的 Underscore.js 使用更广泛。',
          applicationClass: ['其他'],
          developers: 'SMKD科技有限公司',
          inteag: ['SAML', 'http'],
          appAddres: 'http://www.baidu.com',
        },
        {
          avatar:
            'https://fastly.jsdelivr.net/npm/@bootcss/www.bootcss.com@0.0.62/dist/img/gulpjs.png',
          title: 'gulp.js',
          details:
            '基于流的自动化构建工具。gulp.js - 基于流(stream)的自动化构建工具。Grunt 采用配置文件的方式执行任务，而 Gulp 一切都通过代码实现。',
          applicationClass: ['人力资源'],
          developers: 'KOF科技有限公司',
          inteag: ['SAML', 'http'],
          appAddres: 'http://www.baidu.com',
        },
      ],
    });
  },

  'POST  /api/link/getFlowInfo': (req: Request, res: Response) => {
    res.send({
      success: true,
      data: [{
        title: '流名称',
        name: 'zwh',
        labelsID: '修改时间',
        showID: 'G-FLOW-101EDC54B5D6213CAC72000G'
      }, {
        title: '流描述',
        name: 'zwh',
        labelsID: '修改时间',
        showID: 'G-FLOW-101EDC54B5D6213CAC72000G'
      }, {
        title: '流名称',
        name: 'zwh',
        labelsID: '修改时间',
        showID: 'G-FLOW-101EDC54B5D6213CAC72000G'
      }, {
        title: '流名称',
        name: 'zwh',
        labelsID: '修改时间',
        showID: 'G-FLOW-101EDC54B5D6213CAC72000G'
      }]
    })
  },


};
