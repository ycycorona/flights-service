const BaseEntity = require('./BaseEntity');
class User extends BaseEntity {
  get propList() {
    return [ 'user_name', 'avatar', 'nick_name', 'id_user_create_by', 'id_user_update_by', 'status' ];
  }
  constructor(...args) {
    super(...args);
  }
}

module.exports = User;

/* const per = new User({user_name: 'ycy', age: 123})
console.log(per)*/
