'use strict';
const Base = require('../core/base_controller');

class UserController extends Base {
  // 注册
  async register() {
    const { ctx } = this;
    const registerRule = {
      userName: { type: 'string' },
      avatar: { type: 'string', required: false },
      nickName: { type: 'string' },
      authType: { type: 'string' },
      token: { type: 'string' },
    };
    ctx.validate(registerRule);
    const registerRes = await ctx.service.userService.register(ctx.request.body);
    if (registerRes.flag) {
      ctx.body = ctx.successRes(registerRes.data.userInfo);
    } else {
      ctx.body = ctx.failRes({ status: '0', error: '1004', msg: registerRes.errorMsg });
    }
  }
  // 登录成功
  async loginSuccess() {
    const { ctx, service } = this;
    const flag = ctx.isAuthenticated(); // 再次确认一下授权信息
    if (flag) {
      ctx.body = ctx.successRes(flag);
    } else {
      ctx.body = ctx.failRes({ status: '0', error: '1002', msg: 'no login info' });
    }
  }

  // 登录失败
  async loginFail() {
    const { ctx } = this;
    ctx.body = ctx.failRes({ status: '0', error: '1001', msg: 'login fail' + `:${ctx.session.passportFailMsg}||'登录字段不全'` });
  }

  // 登出
  async logout() {
    const { ctx } = this;
    ctx.logout();
    ctx.body = ctx.successRes('logout');
  }

  // 获取当前用户信息
  async getUserInfo() {
    const { ctx } = this;
    ctx.body = ctx.user;
  }

  // 根据用户名获取用户信息
  async getUserInfoByUserName() {
    const { ctx } = this;
    const userName = ctx.params.userName;
    const rule = {
      userName: { type: 'string' },
    };
    ctx.validate(rule, ctx.params);
    const userInfo = await ctx.service.userService.getUserInfoByUserName(userName);
    ctx.body = userInfo;
  }

}

module.exports = UserController;
