/**
 * File: mybind.js
 * Created Date: 2020-08-25  08:59:35 am
 * Author: Bo.Jin
 * -----
 * Last Modified: Bo.Jin
 * Modified By: 2020-08-25 09:00:22 am
 * -----
 * Copyright (c) 2020 ZDWW
 * ------------------------------------
 * -----
 * HISTORY:
 * Date      	 By	Comments
 * ----------	---	----------------------------------------------------------
 */

/**
 * 1st Edition
 */
Function.prototype.myBind = function () {
  // 保存要绑定的this
  var boundThis = arguments[0];
  // 获得预置参数
  var boundParams = [].slice.call(arguments, 1);
  // 获得绑定的目标函数
  var boundTargetFunc = this;
  if (typeof boundTargetFunc !== "function") {
    throw new Error("绑定的目标必须是函数");
  }
  // 返回一个新的函数
  return function () {
    // 获取执行时传入的参数
    var restParams = [].slice.call(arguments);
    // 合并参数
    var allParams = boundParams.concat(restParams);
    // 新函数被执行时，通过执行绑定的目标函数获得结果，并返回结果
    return boundTargetFunc.apply(boundThis, allParams);
  };
};

/**
 * 2ed Edition
 */
Function.prototype.myBind = function () {
  var boundThis = arguments[0];
  var boundParams = [].slice.call(arguments, 1);
  var boundTargetFunc = this;
  if (typeof boundTargetFunc !== "function") {
    throw new Error("绑定的目标必须是函数");
  }
  function fBound() {
    var restParams = [].slice.call(arguments);
    var allParams = boundParams.concat(restParams);
    // 通过instanceof判断this是不是fBound的实例
    var isConstructor = this instanceof fBound;
    if (isConstructor) {
      // 如果是，说明是通过new调用的（这里有bug，见下文），那么只要把处理好的参数传给绑定的目标函数，并通过new调用即可。
      return new boundTargetFunc(...allParams);
    } else {
      // 如果不是，说明不是通过new调用的
      return boundTargetFunc.apply(boundThis, allParams);
    }
  }
  return fBound;
};
