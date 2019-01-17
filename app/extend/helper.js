const passwdSalt = 'av_data_base'
const thinkHelper = require('think-helper')
const nanoid = require('nanoid')
const squel = (require('squel')).useFlavour('mysql')
const _ = require('lodash')

const helper = {
  /**
   * 密码加盐转md5,如果传false,return ''
   * @param val
   * @return {*}
   */
  md5passwdSalt(val) {
    if (!val) {
      return '';
    }
    const saltPasswd = `${val}:${passwdSalt}`;
    return this.md5(saltPasswd);
  },
  /**
   * 驼峰转蛇形命名
   * @param obj
   * @constructor
   */
  objSnakeCase(obj) {
    if (obj && thinkHelper.isArray(obj)) {
      if (obj.length > 0 && thinkHelper.isObject(obj[0])) {
        // 数组里包对象
        const newArray = [];
        obj.forEach((item) => {
          const newObj = {};
          Object.keys(item).forEach((key, index) => {
            newObj[thinkHelper.snakeCase(key)] = item[key];
          });
          newArray.push(newObj)
        })
        return newArray
      } else {
        // 数组字符串
        const newArray = [];
        obj.forEach((item) => {
          newArray.push(thinkHelper.snakeCase(item))
        })
        return newArray
      }
    }
    if (obj && thinkHelper.isObject(obj)) {
      // 对象
      const newObj = {};
      Object.keys(obj).forEach((key, index) => {
        newObj[thinkHelper.snakeCase(key)] = obj[key];
      });
      return newObj;
    }
  },
  /**
   * 蛇形转驼峰命名
   * @param obj
   * @constructor
   */
  objCamelCase(obj) {
    if (obj && thinkHelper.isArray(obj)) {
      if (obj.length > 0 && thinkHelper.isObject(obj[0])) {
        // 数组里包对象
        const newArray = [];
        obj.forEach((item) => {
          const newObj = {};
          Object.keys(item).forEach((key, index) => {
            newObj[thinkHelper.camelCase(key)] = item[key];
          });
          newArray.push(newObj)
        })
        return newArray
      } else {
        // 数组字符串
        const newArray = [];
        obj.forEach((item) => {
          newArray.push(thinkHelper.camelCase(item))
        })
        return newArray
      }
    }
    if (obj && thinkHelper.isObject(obj)) {
      // 对象
      const newObj = {};
      Object.keys(obj).forEach((key, index) => {
        newObj[thinkHelper.camelCase(key)] = obj[key];
      });
      return newObj;
    }
  },
  /**
   * 处理一个对象，
   * 给定键如果为空，则剔除该键，
   * 键数组为空，则剔除所有空键
   * @param obj {Object}
   * @param keyArray {String[]}
   * @return undefined
   */
  delEmptyGivenKey(obj = {}, keyArray = []) {
    if (!(keyArray && thinkHelper.isArray(keyArray))) {
      return
    }
    if (keyArray.length === 0) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key) && thinkHelper.isEmpty(obj[key])) {
          delete obj[key]
        }
      }
    } else {
      keyArray.forEach((key) => {
        if (thinkHelper.isEmpty(obj[key])) {
          delete obj[key]
        }
      })
    }
  },
  /**
   * 生成分页的offset\limit参数
   * @param currentPage {Number}
   * @param pageSize {Number}
   * @param recordTotal {Number}
   * @returns {{pageTotal: number, offset: number, limit: number, pageSize: number, currentPage: number, recordsTotal: number, status: string}}
   */
  paginationHelper(currentPage, pageSize, recordTotal) {
    let pageTotal = Math.ceil(recordTotal/pageSize);
    let offset =  pageSize * (currentPage - 1)
    return{
      status: '1',
      currentPage: currentPage,
      pageTotal: pageTotal,
      pageSize: pageSize,
      recordsTotal: recordTotal,
      offset: offset,
      limit: pageSize
    }
  },
  nanoid,
  squel,
  _
};
Object.assign(helper, thinkHelper);

module.exports = helper;

