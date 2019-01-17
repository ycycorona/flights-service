'use strict';
const path = require('path');
const fs = require('fs');

module.exports = appInfo => {
  const config = exports = {};

  config.siteFile = {
    '/favicon.ico': fs.readFileSync(path.join(appInfo.baseDir, 'public/asset/images/favicon.ico')),
  };


  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1544496710762_6467';

  // add your config here
  config.middleware = [ 'errorHandler', 'loginInterceptor', 'adminInterceptor' ];

  //
  config.passportLocal = {
    usernameField: 'identifier',
    passwordField: 'token',
  };





  config.logger = {
    consoleLevel: 'DEBUG',
    dir: path.join(appInfo.root, 'logs'),
    // dir: '/path/to/your/custom/log/dir', // 自定义日志路径
  };

  exports.static = {
    prefix: '/public/',
    dir: path.join(appInfo.baseDir, 'public'),
  };

  config.bodyParser = {
    jsonLimit: '1mb', // 上传json文件的大小限制
    formLimit: '1mb',
  };

  config.multipart = {
    mode: 'file',
  };
  // 全局异常处理 其中404要单独处理
  config.onerror = {
    /* all(err, ctx) {
      // 在此处定义针对所有响应类型的错误处理方法
      // 注意，定义了 config.all 之后，其他错误处理方法不会再生效
      ctx.body = 'error';
      ctx.status = 500;
    },*/
    /*    html(err, ctx) {
      // html hander
      ctx.body = '<h3>error</h3>';
      ctx.status = 500;
    },*/
    html(err, ctx) {
      console.log(err)
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
      // console.log(err)
      ctx.status = 500;
    },
    /*    jsonp(err, ctx) {
      // 一般来说，不需要特殊针对 jsonp 进行错误定义，jsonp 的错误处理会自动调用 json 错误处理，并包装成 jsonp 的响应格式
    },*/
  };

  config.security = {
    csrf: {
      enable: false,
      useSession: true, // 默认为 false，当设置为 true 时，将会把 csrf token 保存到 Session 中
      // cookieName: 'csrfToken', // Cookie 中的字段名，默认为 csrfToken
      sessionName: 'csrfToken', // Session 中的字段名，默认为 csrfToken
    },
  };

  exports.session = {
    key: '_sSS_store',
    maxAge: 4 * 3600 * 1000, // 4小时
    renew: true, // 自动续期
    httpOnly: true,
    encrypt: true,
  };

  exports.validate = {
    //convert: true,
    // validateRoot: false,
    widelyUndefined: true // convert empty string(''), NaN, Null to undefined
  };

  config.noLoginPath = [
    '^/user/passport/local',
    '^/user/passport/logout$',
    '^/user/register',
  ];

  config.adminPath = [
    '^/admin',
  ];

  return config;
};
