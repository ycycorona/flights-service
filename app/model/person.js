const BaseModel = require('./base_model');

module.exports = class Person extends BaseModel {
  constructor(...args) {
    super(...args);
  }
  async selectList(offset=1, limit=10) {
    return await this.mysqlDb.select(this.tableName, {
      limit: limit, // 返回数据量
      offset: offset, // 数据偏移量
/*      where: {
        name: 'ycy'
      },*/
      orders: [['name', 'asc']], // 排序方式
    });
  }
};
