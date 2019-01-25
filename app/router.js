'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index);
  router.post('/user/register', controller.user.register); // 注册
  router.post('/user/login', controller.user.login); // 登录
  router.get('/user/logout', controller.user.logout); // 登出
  router.get('/user/info', controller.user.getUserInfo); // 获取用户信息
  router.get('/admin/user/info/:userName', controller.user.getUserInfoByUserName); // 根据用户名获取用户信息
  router.get('/admin/user/list', controller.user.getUserList); // 显示用户列表
  router.post('/admin/user/role/add', controller.user.addUserRole); // 添加用户角色
  router.post('/admin/user/role/remove', controller.user.removeUserRole); // 删除用户角色

  router.post('/admin/person/create', controller.person.create); // 创建人员
  router.post('/admin/person/update', controller.person.update); // 修改人员
  router.post('/admin/person/delete', controller.person.destory); // 删除人员
  router.get('/admin/person/detail', controller.person.detail); // 删除人员
  router.get('/admin/person/list', controller.person.list); // 查询人员列表

  router.post('/flights-info/one-day-price-change-among-time', controller.flightsInfo.oneDayPriceAmongTime); // 查询信息
  router.post('/flights-info/test-find', controller.flightsInfo.findByQuery); // 查询信息
  router.get('/flights-info/route-count', controller.flightsInfo.countRouterSearchTimes); // 获取航班总条数
  router.get('/flights-info/get-all-companies', controller.flightsInfo.getAllCompanies); // 查询机场选项
  router.get('/flights-info/routes', controller.flightsInfo.getRoutes); // 查询收录航线
};

