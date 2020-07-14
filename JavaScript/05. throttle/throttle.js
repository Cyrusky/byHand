/**
 * File: scripts.js
 * Created Date: 2020-06-04  15:16:23 pm
 * Author: Bo.Jin
 * -----
 * Last Modified: Bo.Jin
 * Modified By: 2020-06-04 15:33:48 pm
 * -----
 * Copyright (c) 2020 ZDWW
 * ------------------------------------
 * -----
 * HISTORY:
 * Date      	 By	Comments
 * ----------	---	----------------------------------------------------------
 */

let input1 = document.getElementById('input1')
let input2 = document.getElementById('input2')

/**
 * 节流函数
 * @param {Function} fn 一个函数, 作为在time毫秒后执行的回调.
 * @param {*} time 延迟时间.
 */
let throttle = function (fn, time) {
  let timer = null
  return function (args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn(args)
    }, time)
  }
}

let printFunc = throttle(() => {
  let input = document.getElementById('input1')
  console.log(input.value)
}, 1000)

input1.addEventListener('keyup', printFunc)
input2.addEventListener('keyup', () => {
  console.log(input2.value)
})
