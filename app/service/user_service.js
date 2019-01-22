const Service = require('egg').Service;
const RoleMap = require('../../meta/role_map')
class UserService extends Service {
  get userModel() {
    return new (require('../model/user.js'))(this.ctx);
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
    }
    if (loginRes.flag) {
      userRoles = await userModel.getUserRolesByUserName(userAuthInfo.user_name);
      // 登陆成功！
      // 取出需要存入session的用户信息
      loginRes.msg = '登陆成功'
      loginRes.filteredUserInfo = {
        roles: userRoles.map(item => RoleMap[item.user_role].value),
        authType: userAuthInfo.authType,
        userName: userAuthInfo.user_name,
        userId: userAuthInfo.id_user,
        nickName: userInfo.nick_name,
        avatar: userInfo.avatar,
        status: userInfo.status,
/*        id_user_create_by: userInfo.id_user_create_by,
        id_user_update_by: userInfo.id_user_update_by,
        create_time: userInfo.create_time,
        update_time: userInfo.update_time,*/
      }
    }

    return loginRes
  }

  // 根据用户名获取用户信息
  async getUserInfoByUserName(userName = '') {
    return await this.userModel.getUserInfoByUserName(userName);
  }

  //用户分页列表
  async getUserList({queryUserName=''}) {
    return await this.userModel.paginationList({queryUserName});
  }

}

module.exports = UserService;
