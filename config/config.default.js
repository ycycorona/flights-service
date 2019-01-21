'use strict';
const path = require('path');
const fs = require('fs');
const casbin = require('casbin')
const BasicAuthorizer = require('koa-authz/BasicAuthorizer.js')

module.exports = appInfo => {
  const config = exports = {}

  config.siteFile = {
    '/favicon.ico': fs.readFileSync(path.join(appInfo.baseDir, 'public/asset/images/favicon.ico')),
  }

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_15444963770611199204210314_0923'

  // add your config here 要写成驼峰形式
  config.middleware = [ 'errorHandler', 'loginGuard', 'authz', 'permissionGuard']

  config.loginGuard = {
    ignore: (ctx) => {
      const noLoginPath = [
        '^/user/login$',
        '^/user/register$',
      ]
      // 是否不需要登录
      return noLoginPath.findIndex(path => {
        return !!ctx.originalUrl.match(new RegExp(path));
      }) >= 0;
    }
  }

  config.authz = {
    enable: true,
    match: (ctx) => {
      const authNeedPaths = [
        '^/admin',
      ]
      // 是否需要鉴权
      return authNeedPaths.findIndex(path => {
        return !!ctx.originalUrl.match(new RegExp(path));
      }) >= 0
    },
    newEnforcer: async () => {
      // load the casbin model and policy from files, database is also supported.
      return await casbin.newEnforcer('config/authz_model.conf', 'config/authz_policy.csv')
    },
    authorizer: (ctx, enforcer) => {
      class Authorizer extends BasicAuthorizer{
        constructor(ctx, enforcer) {
          super(ctx, enforcer)
        }
        getUserName () {
          // customize to get username from context
          const {user} = this.ctx.session
          let user_name
          if (user) {
            user_name = user.user_name
          }
          return `u_${user_name}`
        }
      }
      return new Authorizer(ctx, enforcer)
    }
  }

  config.logger = {
    consoleLevel: 'DEBUG',
    dir: path.join(appInfo.root, 'logs'),
    // dir: '/path/to/your/custom/log/dir', // 自定义日志路径
  }

  exports.static = {
    prefix: '/public/',
    dir: path.join(appInfo.baseDir, 'public'),
  }

  config.bodyParser = {
    jsonLimit: '1mb', // 上传json文件的大小限制
    formLimit: '1mb',
  }

  config.multipart = {
    mode: 'file',
  }
  // 在自己定义的中间件中处理全局异常，更加灵活
  // 全局异常处理 其中404要单独处理
/*  config.onerror = {
/!*     all(err, ctx) {
      // 在此处定义针对所有响应类型的错误处理方法
      // 注意，定义了 config.all 之后，其他错误处理方法不会再生效
      ctx.body = 'error';
      ctx.status = 500;
    },
        html(err, ctx) {
      // html hander
      ctx.body = '<h3>error</h3>';
      ctx.status = 500;
    },*!/
    html(err, ctx) {
      console.log(abc)
    },
    json(err, ctx) {
      // console.log(err)
      // json hander
      ctx.body = { msg: 'uncaught json request error', status: '0', error: '-110' };
      switch (err.code) {
        case 'invalid_param':
          ctx.body.msg = 'params invalid';
          ctx.body.error = '-111';
          break;
        default:
          break;
      }
      ctx.status = 500;
    },
    /!*    jsonp(err, ctx) {
      // 一般来说，不需要特殊针对 jsonp 进行错误定义，jsonp 的错误处理会自动调用 json 错误处理，并包装成 jsonp 的响应格式
    },*!/
  };*/

  config.security = {
    csrf: {
      enable: false,
      useSession: true, // 默认为 false，当设置为 true 时，将会把 csrf token 保存到 Session 中
      // cookieName: 'csrfToken', // Cookie 中的字段名，默认为 csrfToken
      sessionName: 'csrfToken', // Session 中的字段名，默认为 csrfToken
    },
  }

  exports.session = {
    key: '_sSS_store',
    maxAge: 4 * 3600 * 1000, // 4小时
    renew: true, // 自动续期
    httpOnly: true,
    encrypt: true,
  }

  exports.validate = {
    //convert: true,
    // validateRoot: false,
    widelyUndefined: true // convert empty string(''), NaN, Null to undefined
  }

  config.noLoginPath = [
    '^/user/login$',
    '^/user/register$',
  ]

  return config;
}
