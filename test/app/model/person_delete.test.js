'use strict';
const path = require('path')
const { app, assert } = require('egg-mock/bootstrap');
const nanoid = require('nanoid')

describe('test/app/model/person_delete.test.js', () => {
/*  {fieldCount: 0,
    affectedRows: 1,
    insertId: 0,
    serverStatus: 34,
    warningCount: 0,
    message: '',
    protocol41: true,
    changedRows: 0 }*/
  it('test person delete ', async () => {
    const ctx = app.mockContext();
    const PersonEntity = require(path.join(process.cwd(), '/app/model/entity/Person.js'));
    const personModel = new (require(path.join(process.cwd(), '/app/model/person.js')))(ctx, {tableName: 'persons',Entity: PersonEntity});
    const result = await personModel.delete({cn_name: 'x'})
      .catch(err => {
        console.log(err)
      })
    console.log(result)
    assert(result)
  });
});
