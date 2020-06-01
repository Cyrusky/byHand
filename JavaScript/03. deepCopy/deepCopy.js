/**
 * File: deepCopy.js
 * Created Date: 2020-06-01  08:46:49 am
 * Author: Bo.Jin
 * -----
 * Last Modified: Bo.Jin
 * Modified By: 2020-06-01 10:23:34 am
 * -----
 * Copyright (c) 2020 ZDWW
 * ------------------------------------
 * -----
 * HISTORY:
 * Date      	 By	Comments
 * ----------	---	----------------------------------------------------------
 */

let deepCopy = function deepCopy(obj) {
  let res = obj
  if (
    // 此处函数 也就是typeof obj === function的情况下,没有做判断,因为函数是一段静态代码,不管是深拷贝还是浅拷贝,都不会对其造成改变.
    // 如果不是一个对象的话,那说明obj是一个原始类型. 直接返回.
    typeof obj !== 'object' ||
    // 如果是数字的话,需要额外强调一下,因为数字里面也有一个False值
    typeof obj === 'number' ||
    // 此处就是为了兼容函数的额外处理
    // 如果是一个对象,而且对象不能为False值
    !obj
  ) {
    return obj
  }
  if (Array.isArray(obj)) {
    res = []
  } else {
    res = {}
  }
  for (let key in obj) {
    res[key] = deepCopy(obj[key])
  }
  return res
}

/**
 * 使用json序列化进行拷贝的话,也是返回一个副本,
 * 但是,副本中不会包含函数和Symbol类型.
 * 因为Symbol和函数不是合法的JSON数据类型,在转换的过程中会被丢弃掉.
 * @param {*} obj  任意类型
 */
function jsonCopy(obj) {
  return JSON.parse(JSON.stringify(obj))
}
module.exports = { deepCopy, jsonCopy }
