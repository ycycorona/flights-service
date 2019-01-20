
module.exports = app => {
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
