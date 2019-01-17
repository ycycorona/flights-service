const passportVerify = require('./app/lib/passport/passport_verify.js');
const serializeUser = require('./app/lib/passport/serialize_user.js');
module.exports = app => {
  app.passport.verify(passportVerify); // passport鉴权逻辑
  app.passport.serializeUser(serializeUser); // 储存的用户信息
  app.once('server', server => {
    // console.log(app.config.env)
    // debugger
  });
  app.on('error', (err, ctx) => {
    // report error
  });
  app.on('request', ctx => {
    // log receive request

    // preload before app start
    // debugger
  });
  app.on('response', ctx => {
    // ctx.starttime is set by framework
    // const used = Date.now() - ctx.starttime;
    // debugger
    // log total cost
  });
};
