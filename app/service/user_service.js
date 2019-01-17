const Service = require('egg').Service;
class UserService extends Service {
  get userModel() {
    return new (require('../model/user.js'))(this.ctx);
  }
  // 根据用户名获取用户信息
  async getUserInfoByUserName(userName = '') {
    return await this.userModel.getUserInfoByUserName(userName);
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

    return registerRes;
  }
}

module.exports = UserService;
