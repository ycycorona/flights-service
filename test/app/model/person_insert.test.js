'use strict';
const path = require('path')
const { app, assert } = require('egg-mock/bootstrap');
const nanoid = require('nanoid')

describe('test/app/model/person_insert.test.js', () => {
/* ok {
    "fieldCount": 0,
    "affectedRows": 1,
    "insertId": 10,
    "serverStatus": 2,
    "warningCount": 0,
    "message": "",
    "protocol41": true,
    "changedRows": 0
  }*/

/* err {
    "code": "ER_DUP_ENTRY",
    "errno": 1062,
    "sqlMessage": "Duplicate entry 'Tf_CKWt6f98cscoM-0uV1' for key 'idx_uid'",
    "sqlState": "23000",
    "index": 0,
    "sql": "INSERT INTO `persons`(`uid`, `name`, `gender`, `en_name`, `cn_name`, `birthday`, `nation`) VALUES('Tf_CKWt6f98cscoM-0uV1', '春原未来', 0, 'Miki Sunohara', '春原未来', '1991-11-23', 'ja')"
  }*/
  it('test person insertRow ', async () => {
    const ctx = app.mockContext();
    const insertObj = {
      uid:  nanoid(),
      name: '春原未来',
      gender: 0,
      enName: 'Miki Sunohara',
      cnName: '春原未来',
      birthday: '1991-11-23',
      nation: 'ja',
    }
    const PersonEntity = require(path.join(process.cwd(), '/app/model/entity/Person.js'));
    const personModel = new (require(path.join(process.cwd(), '/app/model/person.js')))(ctx, {tableName: 'persons',entity: PersonEntity});
    const result = await personModel.insertRow(insertObj)
      .catch(err => {
        console.log(err)
      })
    console.log(result)
    assert(result)
  });

  it('test person insertRows ', async () => {
    const ctx = app.mockContext();
    const insertObj_1 = {
      uid:  nanoid(),
      name: '春原未来multi',
      gender: 0,
      enName: 'Miki Sunohara',
      cnName: '春原未来',
      birthday: '1991-11-23',
      nation: 'ja',
    }
    const insertObj_2 = {
      uid:  nanoid(),
      name: '春原未来multi',
      gender: 0,
      enName: 'Miki Sunohara',
      cnName: '春原未来',
      birthday: '1991-11-23',
      nation: 'ja',
    }
    const PersonEntity = require(path.join(process.cwd(), '/app/model/entity/Person.js'));
    const personModel = new (require(path.join(process.cwd(), '/app/model/person.js')))(ctx, {tableName: 'persons',entity: PersonEntity});
    const result = await personModel.insertRows([insertObj_1, insertObj_2])
      .catch(err => {
        console.log(err)
      })
    console.log(result)
    assert(result)
  });
});
