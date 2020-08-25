/**
 * File: myCall.js
 * Created Date: 2020-08-25  08:58:05 am
 * Author: Bo.Jin
 * -----
 * Last Modified: Bo.Jin
 * Modified By: 2020-08-25 08:58:21 am
 * -----
 * Copyright (c) 2020 ZDWW
 * ------------------------------------
 * -----
 * HISTORY:
 * Date      	 By	Comments
 * ----------	---	----------------------------------------------------------
 */
// 首先apply是Function.prototype上的一个方法
Function.prototype.myCall = function () {
  // 由于目标函数的实参数量是不定的，这里就不写形参了
  // 实际上通过arugments对象，我们能拿到所有实参
  // 第一个参数是绑定的this
  var thisArg = arguments[0];
  // 接着要判断是不是严格模式
  var isStrict = (function () {
    return this === undefined;
  })();
  if (!isStrict) {
    // 如果在非严格模式下，thisArg的值是null或undefined，需要将thisArg置为全局对象
    if (thisArg === null || thisArg === undefined) {
      // 获取全局对象时兼顾浏览器环境和Node环境
      thisArg = (function () {
        return this;
      })();
    } else {
      // 如果是其他原始值，需要通过构造函数包装成对象
      var thisArgType = typeof thisArg;
      if (thisArgType === "number") {
        thisArg = new Number(thisArg);
      } else if (thisArgType === "string") {
        thisArg = new String(thisArg);
      } else if (thisArgType === "boolean") {
        thisArg = new Boolean(thisArg);
      }
    }
  }
  // 截取从索引1开始的剩余参数
  var invokeParams = [...arguments].slice(1);
  // 接下来要调用目标函数，那么如何获取到目标函数呢？
  // 实际上this就是目标函数，因为myCall是作为一个方法被调用的，this当然指向调用对象，而这个对象就是目标函数
  // 这里做这么一个赋值过程，是为了让语义更清晰一点
  var invokeFunc = this;
  // 此时如果thisArg对象仍然是null或undefined，那么说明是在严格模式下，并且没有指定第一个参数或者第一个参数的值本身就是null或undefined，此时将目标函数当成普通函数执行并返回其结果即可
  if (thisArg === null || thisArg === undefined) {
    return invokeFunc(...invokeParams);
  }
  // 否则，让目标函数成为thisArg对象的成员方法，然后调用它
  // 直观上来看，可以直接把目标函数赋值给对象属性，比如func属性，但是可能func属性本身就存在于thisArg对象上
  // 所以，为了防止覆盖掉thisArg对象的原有属性，必须创建一个唯一的属性名，可以用Symbol实现，如果环境不支持Symbol，可以通过uuid算法来构造一个唯一值。
  var uniquePropName = Symbol(thisArg);
  thisArg[uniquePropName] = invokeFunc;
  // 返回目标函数执行的结果
  return thisArg[uniquePropName](...invokeParams);
};
