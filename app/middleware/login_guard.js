module.exports = () => {
  return async function loginGuard(ctx, next) {
    // 需要登录
    const isLogin = !!ctx.session.user
    if (isLogin) {
      ctx.user = ctx.session.user
    }
    if (isLogin) {
      await next();
    } else {
      ctx.body = ctx.failRes(ctx.errorCode('NO_USER_INFO'));
    }
  };
};
