const errorCodeMap = {
  LOGIN_ERROR: {
    errNo: '1001',
    msg: '登录失败'
  },
  NO_USER_INFO: {
    errNo: '1002',
    msg: '用户未登录'
  },
  NO_PERMISSION: {
    errNo: '1003',
    msg: '没有访问权限'
  }
}

class ErrCodeFactory{
  constructor({errNo='1000',msg=''}) {
    this.errNo = errNo
    this.msg = msg
  }
}

module.exports = function (errName) {
  if (!errName || errName instanceof String) {
    return new ErrCodeFactory({})
  }
  if (!errorCodeMap[errName]) {
    return new ErrCodeFactory({})
  }
  return new ErrCodeFactory(errorCodeMap[errName])
}
