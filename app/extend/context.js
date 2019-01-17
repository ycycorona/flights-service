module.exports = {
  successRes(data) {
    return {
      status: '1',
      data,
      msg: 'success',
      error: '',
    };
  },
  failRes({ status = '0', error = '1000', msg = 'fail' }) {
    return {
      status,
      data: '',
      msg,
      error,
    };
  },
};
