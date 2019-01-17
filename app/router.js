'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  const localStrategy = app.passport.authenticate('local', {
    successRedirect: '/user/passport/local/success',
    failureRedirect: '/user/passport/local/fail',
  });
  router.get('/', controller.home.index);
  router.post('/user/register', controller.user.register); // 注册
  router.post('/user/passport/local', localStrategy); // 登录
  router.get('/user/passport/logout', controller.user.logout); // 登出
  router.get('/user/passport/local/success', controller.user.loginSuccess); // 登陆成功跳转
  router.get('/user/passport/local/fail', controller.user.loginFail); // 登录失败跳转
  router.get('/user/info', controller.user.getUserInfo); // 获取用户信息
  router.get('/admin/user/info/:userName', controller.user.getUserInfoByUserName); // 根据用户名获取用户信息

  router.post('/admin/person/create', controller.person.create); // 创建人员
  router.post('/admin/person/update', controller.person.update); // 修改人员
  router.post('/admin/person/delete', controller.person.destory); // 删除人员
  router.get('/admin/person/detail', controller.person.detail); // 删除人员
  router.get('/admin/person/list', controller.person.list); // 查询人员列表

  router.post('/flights-info/one-day-price-change-among-time', controller.flightsInfo.oneDayPriceAmongTime); // 查询信息
};

