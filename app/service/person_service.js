const Service = require('egg').Service;
const nanoid = require('nanoid')
const PersonEntity = require('../model/entity/Person.js')
const dayjs = require('dayjs')

// const moduleDebug = require('debug')('personService')

class UserService extends Service {

  get personModel() {
    return new (require('../model/person.js'))(this.ctx, {tableName: 'persons', Entity: PersonEntity});
  }

  get squel() {
    return this.ctx.helper.squel
  }

  async selectList(currentPage = 1, pageSize = 10) {
    const selectListServiceRes = {
      flag: false,
      error: '',
      errorMsg: '',
      data: {},
    }
    const paginationParam = this.ctx.helper.paginationHelper(currentPage, pageSize, 2)
    try {
      const selectRes = await this.personModel.selectList(paginationParam.offset, paginationParam.limit)

      if (selectRes && this.ctx.helper.isArray(selectRes)) {
        const filteredList = selectRes.map((item) => {
          const filteredItem = this.ctx.helper._.omit(item, ['create_time', 'update_time', 'status', 'id'])
          filteredItem.birthday = dayjs(filteredItem.birthday).format('YYYY-MM-DD')
          return filteredItem
        })
        selectListServiceRes.flag = true
        selectListServiceRes.data = this.ctx.helper.objCamelCase(filteredList)
      } else {
        selectListServiceRes.errorMsg = selectRes
      }
    } catch (err) {
      selectListServiceRes.errorMsg = err.message
    }
    return selectListServiceRes
  }

  async find(uid) {
    const findServiceRes = {
      flag: false,
      error: '',
      errorMsg: '',
      data: {},
    }
    try {
      const findRes = await this.personModel.find({uid: uid})

      if (findRes) {
        const filteredFindRes = this.ctx.helper._.omit(findRes, ['create_time', 'update_time', 'status', 'id'])
        filteredFindRes.birthday = dayjs(filteredFindRes.birthday).format('YYYY-MM-DD')
        findServiceRes.flag = true
        findServiceRes.data = this.ctx.helper.objCamelCase(filteredFindRes)
      } else {
        findServiceRes.errorMsg = '未找到该人'
      }
    } catch (err) {
      findServiceRes.errorMsg = err.message
    }
    return findServiceRes
  }

  async create(personParams) {
    this.ctx.logger.info(personParams)
    const personCreateServiceRes = {
      flag: false,
      error: '',
      errorMsg: '',
      data: {},
    }

    let isExist = false
    // 防止uid重复
    let uid
    do {
      uid = this.ctx.helper.nanoid()
      const uidWhereSql = this.squel.expr()
        .and('uid = ?', uid)
      isExist = await this.personModel.checkExist(uidWhereSql)
    } while (isExist)
    personParams.uid = uid
    // 检测idpJavbus重复
    if (personParams.idpJavbus) {
      const idpJavbusWhereSql = this.squel.expr()
        .and('idp_javbus = ?', personParams.idpJavbus)
      isExist = await this.personModel.checkExist(idpJavbusWhereSql)
    } else {
      delete personParams.idpJavbus
    }
    // 如果重复
    if (isExist) {
      personCreateServiceRes.errorMsg = 'idp_javbus重复，无法创建'
      personCreateServiceRes.error = '1005'
      return personCreateServiceRes
    }

    try {
      const insertRes = await this.personModel.insertRow(personParams)

      if (insertRes) {
        personCreateServiceRes.flag = true
        personCreateServiceRes.data.insertId = insertRes.insertId
      } else {
        personCreateServiceRes.errorMsg = insertRes
      }
    } catch (err) {
      personCreateServiceRes.errorMsg = err.message
    }

    return personCreateServiceRes
  }

  // 更新人员信息
  async update(personParams) {
    const personUpdateServiceRes = {
      flag: false,
      error: '',
      errorMsg: '',
      data: {},
    }
    this.ctx.helper.delEmptyGivenKey(personParams)
    const uid = personParams.uid
    delete personParams.uid
    this.logger.info(personParams)
    let isExist = false
    // 检测idpJavbus重复
    if (personParams.idpJavbus) {
      const idpJavbusWhereSql = this.squel.expr()
        .and('idp_javbus = ?', personParams.idpJavbus)
      isExist = await this.personModel.checkExist(idpJavbusWhereSql)
    } else {
      delete personParams.idpJavbus
    }

    if (isExist) {
      personUpdateServiceRes.errorMsg = 'idp_javbus重复，无法更新'
      personUpdateServiceRes.error = '1005'
      return personUpdateServiceRes
    }

    try {
      const updateRes = await this.personModel.updateRow(personParams, {where: {uid}})

      if (updateRes) {
        personUpdateServiceRes.flag = true
        personUpdateServiceRes.data.affectedRows = updateRes.affectedRows
        personUpdateServiceRes.data.changedRows = updateRes.changedRows
      } else {
        personUpdateServiceRes.errorMsg = updateRes
      }
    } catch (err) {
      personUpdateServiceRes.errorMsg = err.message
    }
    return personUpdateServiceRes
  }

  async destroy(uid) {
    const destroyServiceRes = {
      flag: false,
      error: '',
      errorMsg: '',
      data: {},
    }
    try {
      const deleteRes = await this.personModel.delete({uid: uid})

      if (deleteRes) {
        if (deleteRes.affectedRows === 1) {
          destroyServiceRes.flag = true
        } else {
          destroyServiceRes.data.affectedRows = deleteRes.affectedRows
          destroyServiceRes.data.changedRows = deleteRes.changedRows
          destroyServiceRes.errorMsg = '未找到该项目，删除失败'
        }
      } else {
        destroyServiceRes.errorMsg = deleteRes
      }
    } catch (err) {
      destroyServiceRes.errorMsg = err.message
    }
    return destroyServiceRes
  }

}

module.exports = UserService;
