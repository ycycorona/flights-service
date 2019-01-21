module.exports = (option) => {
  return async function permissionGuard(ctx, next) {
    if (ctx.status !== 403) {
      await next();
    } else {
      ctx.body = ctx.failRes(ctx.errorCode('NO_PERMISSION'))
    }
  }
}
