const loginRulesLocal = require('../validate_rules').loginRulesLocal;

module.exports = async (ctx, user) => {
  const userModel = new (require('../../model/user.js'))(ctx);
  const reqTokenMd5 = ctx.helper.md5passwdSalt(user.password);
  ctx.validate(loginRulesLocal);

  const loginRes = {
    flag: false,
    errorData: '',
  };
  // 取出登录验证信息
  const userAuthInfo = await userModel.selectUserAuth('passwd', user.username);
  let userInfo;
  let userRoles;
  let isAdmin = false;
  // 验证登录
  if (!userAuthInfo) {
    loginRes.errorData = '未找到该用户';
  } else if (userAuthInfo.status_user !== 1) {
    loginRes.errorData = '该用户已禁用';
  } else if (userAuthInfo.status_auth !== 1) {
    loginRes.errorData = '请更换登录账号类型重试';
  } else if (reqTokenMd5 !== userAuthInfo.token) {
    loginRes.errorData = '密码不正确';
  } else {
    loginRes.flag = true;
    // 登陆成功后，获取详细用户信息
    userInfo = await userModel.getUserInfoByUserName(userAuthInfo.user_name);
    userRoles = await userModel.getUserRolesByUserName(userAuthInfo.user_name);
  }
  if (userRoles.findIndex(role => { return role.user_role === 0; }) >= 0) {
    isAdmin = true;
  }
  if (loginRes.flag) {
    return {
      provider: user.provider,
      isAdmin,
      user_name: userAuthInfo.user_name,
      id_user: userAuthInfo.id_user,
      nick_name: userInfo.nick_name,
      avatar: userInfo.avatar,
      status: userInfo.status,
      id_user_create_by: userInfo.id_user_create_by,
      id_user_update_by: userInfo.id_user_update_by,
      create_time: userInfo.create_time,
      update_time: userInfo.update_time,
    };
  }
  ctx.session.passportFailMsg = loginRes;
  return false;

};
