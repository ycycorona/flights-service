'use strict';
const Base = require('./base_controller');
const RoleMap = require('../../meta/role_map')

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
      ctx.body = ctx.failRes({ status: '0', errNo: '1004', msg: registerRes.errorMsg });
    }
  }

  //登陆
  async login() {
    const { ctx } = this
    const loginRule = {
      identifier: { type: 'string' }, // 标识符
      token: { type: 'string' }, // 密码
    }
    ctx.validate(loginRule)
    const loginRes = await ctx.service.userService.login(ctx.request.body);

    if (loginRes.flag) {
      ctx.session.user = loginRes.filteredUserInfo
      ctx.body =ctx.successRes(loginRes.msg)
    } else {
      ctx.body =ctx.failRes(ctx.errorCode('LOGIN_ERROR', loginRes.msg))
    }
  }

  // 登出
  async logout() {
    const { ctx } = this
    if (!ctx.session.user) {
      ctx.body = ctx.failRes({msg: '登出失败：用户尚未登陆！'})
      return
    }
    ctx.session = null // 清除用户session信息
    ctx.body = ctx.successRes('用户登出')
  }

  // 获取当前用户信息
  async getUserInfo() {
    const { ctx } = this
    const userInfo = ctx.session.user
    if (userInfo) {
      // ctx.body = ctx.successRes(userInfo)
      ctx.body = ctx.successRes({
        roles: userInfo.roles,
        userName: userInfo.user_name,
        avatar: userInfo.avatar
      })
    } else {
      ctx.body = ctx.failRes(ctx.errorCode('NO_USER_INFO'))
    }
  }

  // 根据用户名获取用户信息
  async getUserInfoByUserName() {
    const { ctx } = this;
    const userName = ctx.params.userName;
    const rule = {
      userName: { type: 'string' },
    };
    ctx.validate(rule, ctx.params);
    const userInfo = await ctx.service.userService.getUserInfoByUserName(userName)
    ctx.body = userInfo;
  }

  // 获取用户列表
  async getUserList() {
    const { ctx } = this
    const userQueryRule = {
      userName: {type: 'string', required: false }
    }
    ctx.validate(userQueryRule, ctx.query)
    const queryUserName = ctx.query.userName || ''
    const roleList = await ctx.service.userService.getUserList({queryUserName})
    const userMap = new Map()
    const resList = []
    roleList.forEach((user) => {
      const roleName = user.userRole ? RoleMap[user.userRole].value : user.userRole
      if (userMap.has(user.userName) && roleName) {
        userMap.get(user.userName).userRoles.push(roleName)
      } else {
        userMap.set(user.userName, {
          userName: user.userName,
          userId: user.userId,
          userRoles: []
        })
        if (roleName) {
          userMap.get(user.userName).userRoles.push(roleName)
        }
      }
    })
    for(const [,user] of userMap) {
      resList.push(user)
    }
    ctx.body = resList;
  }

}

module.exports = UserController;
