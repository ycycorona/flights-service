module.exports = () => {
  return async function loginInterceptor(ctx, next) {
    // 是否不需要登录
    const isMatchNologinList = ctx.app.config.noLoginPath.findIndex(path => {
      return !!ctx.originalUrl.match(new RegExp(path));
    }) >= 0;
    let isLogin;
    if (!isMatchNologinList) {
      // 需要登录
      isLogin = !!ctx.session.user
    }
    if (isMatchNologinList || isLogin) {
      await next();
    } else {
      ctx.body = ctx.failRes({ status: '0', errNo: '1002', msg: '用户未登录' });
    }

  };
};
