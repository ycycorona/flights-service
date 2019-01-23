const BaseModel = require('./base_model');

const UserEntity = require('./entity/User.js');
const AuthEntity = require('./entity/Auth.js');
module.exports = class UserModel extends BaseModel {
  constructor(...args) {
    super(...args);
  }
  // 分页用户列表
  async paginationList({offset=0, limit=10, queryUserName}) {
    const uSql = this.squel.select()
      .field('u.user_name')
      .field('u.id')
      .function('count(?)', '*')
      .from('users', 'u')
      .offset(offset)
      .limit(limit)
    if (queryUserName) {
      uSql.where('u.user_name like ?', `%${queryUserName}%`)
    }

    const querySql = this.squel.select()
      .field('u.user_name', 'userName')
      .field('u.id', 'userId')
      .field('r.user_role', 'userRole')
      .field('u.count', 'count')
      .from(uSql, 'u')
      .left_join('user_roles', 'r', 'u.id = r.id_user')
    const querySqlStr = querySql.toString()
    this.ctx.logger.info(querySqlStr)
    const resList = await this.mysqlDb.query(querySqlStr);
    return resList || []
  }

  async selectUserAuth(authType, identifier) {
    const querySql = this.squel.select()
      .field('u.user_name')
      .field('u.avatar')
      .field('u.nick_name')
      .field('u.status', 'status_user')
      .field('a.id_user')
      .field('a.auth_type')
      .field('a.identifier')
      .field('a.token')
      .field('a.status', 'status_auth')
      .from('users', 'u')
      .join(
        this.squel.select().from('user_auths', 'a')
          .where(
            'a.identifier=? AND a.auth_type=?', identifier, authType
          ), 'a', 'u.id = a.id_user'
      )
      .toString();
    const resList = await this.mysqlDb.query(querySql);
    return this.helper.isEmpty(resList) ? null : resList[0];
  }
  // 获取用户信息
  async getUserInfoByUserName(userName = '') {
    const querySql = this.squel.select()
      .from('users', 'u')
      .where(
        'u.user_name=?', userName
      )
      .toString();
    const resList = await this.mysqlDb.query(querySql);
    return this.helper.isEmpty(resList) ? null : resList[0];
  }
  // 获取用户角色
  async getUserRolesByUserName(userName = '') {
    const querySql = this.squel.select()
      .field('user_role')
      .from('user_roles', 'r')
      .where(
        'r.id_user=?',
        this.squel.select().field('id').from('users')
          .where('user_name=?', userName)
      )
      .toString();
    const resList = await this.mysqlDb.query(querySql)
    return resList || []
  }
  // 注册
  async register(userObj) {
    const user = new UserEntity(userObj);
    const auth = new AuthEntity(userObj);
    auth.identifier = userObj.userName;
    const insertUserRes = {
      flag: false,
      error: '',
      errorMsg: '',
      data: {},
    };
    const transactionResult = await this.mysqlDb.beginTransactionScope(async conn => {
      const insertUserRes = await conn.insert('users', user);
      const insertAuthRes = await conn.insert('user_auths', auth);
      return true;
    }, this.ctx).catch(err => {
      insertUserRes.error = err.errno;
      insertUserRes.errorMsg = err.message;
    });

    if (transactionResult) {
      insertUserRes.flag = true;
      insertUserRes.data.userInfo = await this.getUserInfoByUserName(user.user_name);
    }

    return insertUserRes;
  }
};
