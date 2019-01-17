'use strict';
const Base = require('../core/base_controller');
const userCreateRule = {
  name: { type: 'string',  },
  gender: { type: 'int', required:false, convertType: 'int'},
  enName: { type: 'string', required:false},
  cnName: { type: 'string', required:false},
  birthday: { type: 'date', required:false},
  nation: { type: 'string', required:false},
  idpJavbus: { type: 'string', required:false},
}
const userUpdateRule = {
  uid: { type: 'string', required:true },
  name: { type: 'string', required:false },
  gender: { type: 'int', required:false, convertType: 'int'},
  enName: { type: 'string', required:false},
  cnName: { type: 'string', required:false},
  birthday: { type: 'date', required:false},
  nation: { type: 'string', required:false},
  idpJavbus: { type: 'string', required:false},
}
const paginationListRule = {
  currentPage: { type: 'int', required:true, convertType: 'int'},
  pageSize: { type: 'int', required:true, convertType: 'int'},
}
class PersonController extends Base {
  async index() {
    const { ctx } = this;
    ctx.body = 'home';
  }

  async detail() {
    const { ctx } = this;
    ctx.validate({uid: {type: 'string',required: true}}, ctx.request.query)
    const personFindServiceRes =  await ctx.service.personService.find(ctx.request.query.uid)
    if (personFindServiceRes.flag) {
      ctx.body = ctx.successRes(personFindServiceRes.data)
    } else {
      ctx.body = ctx.failRes({msg: personFindServiceRes.errorMsg, error: personFindServiceRes.error})
    }
  }

  async list() {
    const { ctx } = this;
    ctx.validate(paginationListRule, ctx.request.query)
    const personListServiceRes =  await ctx.service.personService.selectList(ctx.request.query.currentPage, ctx.request.query.pageSize)
    if (personListServiceRes.flag) {
      ctx.body = ctx.successRes(personListServiceRes.data)
    } else {
      ctx.body = ctx.failRes({msg: personListServiceRes.errorMsg, error: personListServiceRes.error})
    }
  }

  async create() {
    const { ctx } = this;
    ctx.validate(userCreateRule)
    const personCreateServiceRes =  await ctx.service.personService.create(ctx.request.body)
    if (personCreateServiceRes.flag) {
      ctx.body = ctx.successRes(personCreateServiceRes.data)
    } else {
      ctx.body = ctx.failRes({msg: personCreateServiceRes.errorMsg, error: personCreateServiceRes.error})
    }

  }
  async update() {
    const { ctx } = this;
    ctx.validate(userUpdateRule)
    const personUpdateServiceRes =  await ctx.service.personService.update(ctx.request.body)
    if (personUpdateServiceRes.flag) {
      ctx.body = ctx.successRes(personUpdateServiceRes.data)
    } else {
      ctx.body = ctx.failRes({msg: personUpdateServiceRes.errorMsg, error: personUpdateServiceRes.error})
    }
  }

  async destory() {
    const { ctx } = this;
    ctx.validate({uid: {type: 'string',required: true}})
    const personDestroyServiceRes =  await ctx.service.personService.destroy(ctx.request.body.uid)
    if (personDestroyServiceRes.flag) {
      ctx.body = ctx.successRes(personDestroyServiceRes.data)
    } else {
      ctx.body = ctx.failRes({msg: personDestroyServiceRes.errorMsg, error: personDestroyServiceRes.error})
    }
  }
}

module.exports = PersonController;
