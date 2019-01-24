const errorCode = require('../lib/error-code')
module.exports = {
  successRes(data = '') {
    return {
      status: '1',
      data,
      msg: 'success',
      error: '',
    };
  },
  failRes({status = '0', errNo = '1000', msg = 'fail', data = ''} = {}) {
    errNo = String(errNo)
    return {
      status,
      data,
      msg,
      errNo,
    }
  },
  errorCode,
  handleRes({flag = false, msg = '', data = '', error = null, errNo = ''}={}) {
    return {
      flag,
      msg,
      data,
      error,
      errNo
    }
  }
}
