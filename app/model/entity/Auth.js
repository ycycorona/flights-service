const BaseEntity = require('./BaseEntity');

module.exports = class Auth extends BaseEntity {
  get propList() {
    return [ 'is_user', 'auth_type', 'identifier', 'token', 'status' ];
  }
  constructor(...args) {
    super(...args);
  }
};

