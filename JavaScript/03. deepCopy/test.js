/**
 * File: test.js
 * Created Date: 2020-06-01  08:47:53 am
 * Author: Bo.Jin
 * -----
 * Last Modified: Bo.Jin
 * Modified By: 2020-06-01 10:22:48 am
 * -----
 * Copyright (c) 2020 ZDWW
 * ------------------------------------
 * -----
 * HISTORY:
 * Date      	 By	Comments
 * ----------	---	----------------------------------------------------------
 */

let { deepCopy, jsonCopy } = require('./deepCopy')
let a = [
  {
    a: [2],
    f: () => {},
    s: Symbol('s')
  }
]

let b = a
let c = deepCopy(a)
let d = jsonCopy(a)

console.log(a)
console.log(b)
console.log(d)
