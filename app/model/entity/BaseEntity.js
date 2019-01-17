const _ = require('lodash');
const helper = require('../../extend/helper.js');
module.exports = class BaseEntity {
  get propList() {
    return [];
  }
  constructor(obj, option) {
    const snakeCaseObj = helper.objSnakeCase(obj);
    BaseEntity._.assign(this, BaseEntity._.pick(snakeCaseObj, this.propList));
  }
  static get _() {
    return _;
  }
};

