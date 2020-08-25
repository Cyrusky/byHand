/**
 * File: myApply.js
 * Created Date: 2020-08-25  08:58:47 am
 * Author: Bo.Jin
 * -----
 * Last Modified: Bo.Jin
 * Modified By: 2020-08-25 08:59:12 am
 * -----
 * Copyright (c) 2020 ZDWW
 * ------------------------------------
 * -----
 * HISTORY:
 * Date      	 By	Comments
 * ----------	---	----------------------------------------------------------
 */
Function.prototype.myApply = function (thisArg, params) {
  var isStrict = (function () {
    return this === undefined;
  })();
  if (!isStrict) {
    var thisArgType = typeof thisArg;
    if (thisArgType === "number") {
      thisArg = new Number(thisArg);
    } else if (thisArgType === "string") {
      thisArg = new String(thisArg);
    } else if (thisArgType === "boolean") {
      thisArg = new Boolean(thisArg);
    }
  }
  var invokeFunc = this;
  // 处理第二个参数
  var invokeParams = Array.isArray(params) ? params : [];
  if (thisArg === null || thisArg === undefined) {
    return invokeFunc(...invokeParams);
  }
  var uniquePropName = Symbol(thisArg);
  thisArg[uniquePropName] = invokeFunc;
  return thisArg[uniquePropName](...invokeParams);
};
