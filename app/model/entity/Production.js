const BaseEntity = require('./BaseEntity');
class Production extends BaseEntity {
  get propList() {
    return [ 'id', 'uid', 'com_id', 'title', 'pub_date', 'location', 'cover', 'status', 'id_review', 'id_user_create_by', 'id_user_update_by' ];
  }
  constructor(...args) {
    super(...args);
  }
}

module.exports = Production;
