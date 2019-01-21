const errorCode = require('../lib/error-code')
module.exports = {
  successRes(data) {
    return {
      status: '1',
      data,
      msg: 'success',
      error: '',
    };
  },
  failRes({ status = '0', errNo = '1000', msg = 'fail' }) {
    errNo = String(errNo)
    return {
      status,
      data: '',
      msg,
      errNo,
    };
  },
  errorCode
}
