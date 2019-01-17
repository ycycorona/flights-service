'use strict';
const path = require('path')
const { app, assert } = require('egg-mock/bootstrap');
const nanoid = require('nanoid')

describe('test/app/model/person_find.test.js', () => {
/*  {
    "id": 2,
    "uid": "Tf_CKWt6f98cscoM-0uV1",
    "name": "春原未来",
    "gender": 0,
    "en_name": "Miki Sunohara",
    "cn_name": "春原未来",
    "birthday": "1991-11-22T16:00:00.000Z",
    "nation": "ja",
    "status": 1,
    "create_time": "2018-12-28T03:09:05.000Z",
    "update_time": "2018-12-28T03:09:05.000Z"
  }*/
  it('test person find ', async () => {
    const ctx = app.mockContext();
    const PersonEntity = require(path.join(process.cwd(), '/app/model/entity/Person.js'));
    const personModel = new (require(path.join(process.cwd(), '/app/model/person.js')))(ctx, {tableName: 'persons',entity: PersonEntity});
    const result = await personModel.find({id: 2})
      .catch(err => {
        console.log(err)
      })
    assert(result)
  });
});
