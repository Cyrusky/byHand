/**
 * File: pandStart.js
 * Created Date: 2020-06-03  17:28:08 pm
 * Author: Bo.Jin
 * -----
 * Last Modified: Bo.Jin
 * Modified By: 2020-06-03 17:38:48 pm
 * -----
 * Copyright (c) 2020 ZDWW
 * ------------------------------------
 * -----
 * HISTORY:
 * Date      	 By	Comments
 * ----------	---	----------------------------------------------------------
 */

String.prototype.myPadStart = function (len, slot) {
  if (len <= this.length) {
    return this + ''
  }
  slot = (slot || ' ') + ''
  let repeatTimes = Math.ceil((len - this.length) / slot.length)
  return slot.repeat(repeatTimes).substr(0, len - this.length) + this
}
String.prototype.myPadEnd = function (len, slot) {
  if (len <= this.length) {
    return this + ''
  }
  slot = (slot || ' ') + ''
  let repeatTimes = Math.ceil((len - this.length) / slot.length)
  return this + slot.repeat(repeatTimes).substr(0, len - this.length)
}
