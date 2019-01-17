'use strict';
const path = require('path')
const { app, assert } = require('egg-mock/bootstrap');
const nanoid = require('nanoid')

describe('test/app/model/person_update.test.js', () => {
/*  {
    "fieldCount": 0,
    "affectedRows": 2, //命中的行
    "insertId": 0,
    "serverStatus": 2,
    "warningCount": 0,
    "message": "(Rows matched: 2  Changed: 2  Warnings: 0",
    "protocol41": true,
    "changedRows": 2 //实际改变的行数
  }*/
  it('test person updateRows ', async () => {
    const ctx = app.mockContext();
    const PersonEntity = require(path.join(process.cwd(), '/app/model/entity/Person.js'));
    const personModel = new (require(path.join(process.cwd(), '/app/model/person.js')))(ctx, {tableName: 'persons',entity: PersonEntity});
    const result = await personModel.updateRows([{
      row: {
        nation: 'us',
        gender: 1,
        cnName: '春'
      },
      where: {
        id: 2
      }
    },{
      row: {
        nation: 'us',
        gender: 1,
        cnName: '原'
      },
      where: {
        id: 13
      }
    }])
      .catch(err => {
        console.log(err)
      })
    console.log(result)
    assert(result)
  });
  it('test person updateRow ', async () => {
    const ctx = app.mockContext();
    const PersonEntity = require(path.join(process.cwd(), '/app/model/entity/Person.js'));
    const personModel = new (require(path.join(process.cwd(), '/app/model/person.js')))(ctx, {tableName: 'persons',entity: PersonEntity});
    const result = await personModel.updateRow({
      nation: 'ja',
      gender: 1,
      cnName: '春春'
    }, {
      where: {
        id: 2
      }
    })
      .catch(err => {
        console.log(err)
      })
    console.log(result)
    assert(result)
  });
});
