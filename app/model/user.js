const BaseModel = require('./base_model');

const UserEntity = require('./entity/User.js');
const AuthEntity = require('./entity/Auth.js');
module.exports = class UserModel extends BaseModel {
  constructor(...args) {
    super(...args)
  }

  // 分页用户列表
  async pagiUserList(offset=0, limit=10, queryUserName) {
    const uSql = this.squel.select()
      .field('u.user_name')
      .field('u.id')
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
      .from(uSql, 'u')
      .left_join('user_roles', 'r', 'u.id = r.id_user')
    const querySqlStr = querySql.toString()
    const countSqlStr = this.squel.select()
      .field('count(id)', 'count')
      .from('users', 'u')
      .toString()
    this.ctx.logger.info(querySqlStr, countSqlStr)
    const rowQuery = this.mysqlDb.query(querySqlStr)
    const countQuery = this.mysqlDb.query(countSqlStr)

    const queryRes = await Promise.all([rowQuery, countQuery]) || null
    return this.getPaginationList(offset, limit, queryRes)
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

  // 根据用户名添加用户角色
  async addUserRole(userName, role) {
    const modelRes = this.ctx.handleRes()
    let insertRes
    const transactionResult = await this.mysqlDb.beginTransactionScope(async conn => {
      const user = await conn.get(this.tableName, {
        user_name: userName
      }, {columns: ['id']})
      if (!user) {
        modelRes.msg = '用户不存在'
        throw '用户不存在'
      }
      const userId = user.id
      const userRole = await conn.get('user_roles', {
        id_user: userId,
        user_role: role
      })
      if (userRole) {
        modelRes.msg = '用户已存在该角色'
        throw '用户已存在该角色'
      }
      insertRes = await conn.insert('user_roles', {user_role: role, id_user: userId})
    }, this.ctx).catch(err => {
      this.ctx.logger.error(err)
    });

    if (insertRes && insertRes.affectedRows === 1) {
      modelRes.flag = true
    }
    return modelRes
  }

  // 根据用户名删除用户角色
  async removeUserRole(userName, role) {
    const modelRes = this.ctx.handleRes()
    let removeRes
    const transactionResult = await this.mysqlDb.beginTransactionScope(async conn => {
      const user = await conn.get(this.tableName, {
        user_name: userName
      }, {columns: ['id']})
      if (!user) {
        modelRes.msg = '用户不存在'
        throw '用户不存在'
      }
      const userId = user.id
      removeRes = await conn.delete('user_roles', {user_role: role, id_user: userId})
    }, this.ctx).catch(err => {
      this.ctx.logger.error(err)
    });

    if (removeRes && removeRes.affectedRows===1) {
      modelRes.flag = true
    } else {
      modelRes.msg = '用户无此角色'
    }
    return modelRes
  }

};
