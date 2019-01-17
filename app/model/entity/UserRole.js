const BaseEntity = require('./BaseEntity');
class UserRole extends BaseEntity {
  get propList() {
    return [ 'id', 'user_role', 'id_user' ];
  }
  constructor(...args) {
    super(...args);
  }
}

module.exports = UserRole;

/* const per = new User({user_name: 'ycy', age: 123})
console.log(per)*/
