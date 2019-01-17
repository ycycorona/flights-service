const BaseEntity = require('./BaseEntity');
class Person extends BaseEntity {
  get propList() {
    return [ 'id', 'uid', 'name', 'gender', 'en_name', 'cn_name', 'birthday', 'nation', 'name', 'status', 'idp_javbus' ];
  }
  constructor(...args) {
    super(...args);
  }
}

module.exports = Person;
