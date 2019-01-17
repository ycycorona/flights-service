'use strict';
const path = require('path')
const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/home.test.js', () => {

/*  it('should assert', function* () {
    const pkg = require('../../../package.json');
    assert(app.config.keys.startsWith(pkg.name));

    // const ctx = app.mockContext({});
    // yield ctx.service.xx();
  });

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect(200);
  });*/
  it('test find ', async () => {
    const ctx = app.mockContext();
    const personModel = new (require(path.join(process.cwd(), '/app/model/person.js')))(ctx, {tableName: 'users'});
    const result = await personModel.find({user_name: 'root'})
    assert(result)
  });
});
