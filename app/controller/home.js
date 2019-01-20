'use strict';
const Base = require('./base_controller');
class HomeController extends Base {
  async index() {
    const { ctx } = this;
    ctx.body = 'home';
  }
}

module.exports = HomeController;
