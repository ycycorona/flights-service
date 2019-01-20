module.exports = () => {
  return async function notFoundHandler(ctx, next) {
    try {
      await next();
      if (ctx.status === 404 && !ctx.body) {
        ctx.body = ctx.failRes({errNo: '1006', msg:'404 not found', status: '0'})
/*        if (ctx.acceptJSON) {
          ctx.body = { errNo: 'Not Found' };
        } else {
          ctx.body = '<h1>Page Not Found</h1>';
        }*/
      }
    } catch (err) {
      ctx.app.emit('error', err, ctx); // 通知给框架记录错误
      let error = null
      const status = err.status || 500;
      if (status === 500) {
        // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
        error = ctx.app.config.env === 'prod'
          ? 'Internal Server Error'
          : err.message
      }
      if (status === 422) {
        error = err.message
      }
      if (status === 404) {
        error = err.message
      }
      ctx.status = status
      ctx.body = ctx.failRes({msg: error, errNo: err.errNo})
    }
  };
};
