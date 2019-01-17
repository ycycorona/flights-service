module.exports = () => {
  return async function adminInterceptor(ctx, next) {
    // 是否需要管理员权限
    const isAdminPath = ctx.app.config.adminPath.findIndex(path => {
      return !!ctx.originalUrl.match(new RegExp(path));
    }) >= 0;
    let isAdmin = false;
    if (isAdminPath) {
      // 需要管理员，验证管理员状态
      isAdmin = ctx.user.isAdmin;
    }
    if (!isAdminPath || isAdmin) {
      await next();
    } else {
      ctx.body = ctx.failRes({ status: '0', error: '1003', msg: 'no admin auth' });
    }

  };
};
