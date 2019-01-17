const BaseModel = require('./base_model');


module.exports = class TestModel extends BaseModel {
  constructor(...args) {
    super(...args);
  }
/*  get mysqlDb() {
    return this.ctx.app.mysql.get('imdb');
  }*/
};
