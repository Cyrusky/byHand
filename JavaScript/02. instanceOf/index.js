/**
 * File: index.js
 * Created Date: 2020-06-01  08:21:14 am
 * Author: Bo.Jin
 * -----
 * Last Modified: Bo.Jin
 * Modified By: 2020-06-01 08:37:01 am
 * -----
 * Copyright (c) 2020 ZDWW
 * ------------------------------------
 * -----
 * HISTORY:
 * Date      	 By	Comments
 * ----------	---	----------------------------------------------------------
 */
function instanceOfByHand(obj, type) {
  let objPototype = obj.__proto__
  let typePrototype = type.prototype
  /**
   * 循环判断对象的原型,不停的溯源,如果原型链上一直没有这个实例的原型,则返回False, 否则返回True
   */
  while (true) {
    if (objPototype == null) {
      return false
    }
    if (objPototype == typePrototype) {
      return true
    }
    objPototype = objPototype.__proto__
  }
}

module.exports = { instanceOfByHand }
