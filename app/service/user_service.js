const Service = require('egg').Service;
const RoleMap = require('../../meta/role_map')
class UserService extends Service {
  get userModel() {
    return new (require('../model/user.js'))(this.ctx, {tableName: 'users'});
  }
  // 根据用户名获取用户信息
  async getUserInfoByUserName(userName = '') {
    const roles = await this.userModel.getUserRolesByUserName(userName)
    const userInfo = await this.userModel.getUserInfoByUserName(userName)
    userInfo.roles = roles
    return userInfo
  }
  // 用户注册
  async register(userObj) {
    let insertUserRes;
    const registerRes = {
      flag: false,
      error: '',
      errorMsg: '',
      data: {},
    };
    const isExistUser = await this.getUserInfoByUserName(userObj.userName);
    if (0) {
      // 用户已存在
      registerRes.errorMsg = '用户已存在';
    } else {
      insertUserRes = await this.userModel.register(userObj);
      if (insertUserRes.flag) {
        registerRes.flag = true;
        registerRes.data.userInfo = insertUserRes.data.userInfo;
      } else {
        registerRes.errorMsg = '注册失败:数据库创建用户失败:' + insertUserRes.errorMsg;
        registerRes.error = insertUserRes.error;
      }
    }

    return registerRes
  }

  // 用户登录
  async login(userTokenInfo) {
    const {userModel} = this
    const loginRes = {
      flag: false,
      msg: '',
      filteredUserInfo: null
    }
    const reqTokenMd5 = this.ctx.helper.md5passwdSalt(userTokenInfo.token)
    // 取出登录验证信息
    const userAuthInfo = await userModel.selectUserAuth('passwd', userTokenInfo.identifier)
    let userInfo
    let userRoles
    let isAdmin = false
    // 验证登录
    if (!userAuthInfo) {
      loginRes.msg = '未找到该用户';
    } else if (userAuthInfo.status_user !== 1) {
      loginRes.msg = '该用户已禁用';
    } else if (userAuthInfo.status_auth !== 1) {
      loginRes.msg = '请更换登录账号类型重试';
    } else if (reqTokenMd5 !== userAuthInfo.token) {
      loginRes.msg = '密码不正确';
    } else {
      loginRes.flag = true;
      // 登陆成功后，获取详细用户信息
      userInfo = await userModel.getUserInfoByUserName(userAuthInfo.user_name);
      userRoles = await userModel.getUserRolesByUserName(userAuthInfo.user_name);
      if (userRoles.findIndex(role => { return role.user_role === 0; }) >= 0) {
        isAdmin = true;
      }
    }

    if (loginRes.flag) {
      // 登陆成功！
      // 取出需要存入session的用户信息
      loginRes.msg = '登陆成功'
      loginRes.filteredUserInfo = {
        authType: userAuthInfo.authType,
        isAdmin,
        user_name: userAuthInfo.user_name,
        id_user: userAuthInfo.id_user,
        nick_name: userInfo.nick_name,
        avatar: userInfo.avatar,
        status: userInfo.status,
        roles: userRoles.map(item => RoleMap[item.user_role].value)
/*        id_user_create_by: userInfo.id_user_create_by,
        id_user_update_by: userInfo.id_user_update_by,
        create_time: userInfo.create_time,
        update_time: userInfo.update_time,*/
      }
    }

    return loginRes
  }

  // 用户分页列表
  async getUserList({offset, limit, userName: queryUserName}={}) {
    const queryRes = await this.userModel.pagiUserList(offset, limit, queryUserName)
    const roleList = queryRes.rows
    const userMap = new Map()
    const userList = []
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
      userList.push(user)
    }
    return {
      rows: userList,
      count: queryRes.count,
      offset: queryRes.offset,
      limit: queryRes.limit
    }
  }
  // 添加用户角色
  async addUserRole({userName, role}) {
    const {ctx} = this
    const serviceRes = ctx.handleRes()
    if (! (userName && role)) {
      return serviceRes
    }
    const modelRes = await this.userModel.addUserRole(userName, role)
    if (modelRes.flag) {
      serviceRes.flag = true
      return serviceRes
    } else {
      serviceRes.msg = modelRes.msg
      return serviceRes
    }
  }

  // 删除用户角色
  async removeUserRole({userName, role}) {
    const {ctx} = this
    const serviceRes = ctx.handleRes()
    if (! (userName && role)) {
      return serviceRes
    }
    const modelRes = await this.userModel.removeUserRole(userName, role)
    if (modelRes.flag) {
      serviceRes.flag = true
      return serviceRes
    } else {
      serviceRes.msg = modelRes.msg
      return serviceRes
    }
  }
}

module.exports = UserService;
