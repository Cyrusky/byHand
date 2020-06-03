/**
 * File: pandStart.js
 * Created Date: 2020-06-03  17:28:08 pm
 * Author: Bo.Jin
 * -----
 * Last Modified: Bo.Jin
 * Modified By: 2020-06-03 17:52:51 pm
 * -----
 * Copyright (c) 2020 ZDWW
 * ------------------------------------
 * -----
 * HISTORY:
 * Date      	 By	Comments
 * ----------	---	----------------------------------------------------------
 */

String.prototype.myPadStart = function (len, slot) {
  len = len >> 0
  slot = String(typeof slot !== 'undefined' ? slot : '')
  if (len <= this.length || slot.length === 0) {
    return String(this)
  }
  return String(
    slot
      .repeat(Math.ceil((len - this.length) / slot.length))
      .slice(0, len - this.length) + this
  )
}
String.prototype.myPadEnd = function (len, slot) {
  len = len >> 0
  slot = String(typeof slot !== 'undefined' ? slot : '')
  if (len <= this.length || slot.length === 0) {
    return String(this)
  }
  return String(
    this +
      slot
        .repeat(Math.ceil((len - this.length) / slot.length))
        /**
         * 此处使用slice的第二个参数其实并不是长度的意思,
         * 但是因为其开始位置的索引为0, 所以,结束位置的索引自然就是长度了.
         * 上面的Start函数一样.
         * 此处不建议使用substr, substr并不是一个JavaScript标准函数,如果非要使用,请使用String.prototype.substring
         * 参考链接: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/substr
         */
        .slice(0, len - this.length)
  )
}
