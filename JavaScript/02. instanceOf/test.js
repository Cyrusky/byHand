/**
 * File: test.js
 * Created Date: 2020-06-01  08:33:13 am
 * Author: Bo.Jin
 * -----
 * Last Modified: Bo.Jin
 * Modified By: 2020-06-01 08:36:02 am
 * -----
 * Copyright (c) 2020 ZDWW
 * ------------------------------------
 * -----
 * HISTORY:
 * Date      	 By	Comments
 * ----------	---	----------------------------------------------------------
 */
let { instanceOfByHand } = require('./index')

let a = [0, 1, 2, 3]
let b = Array(1)
let c = 1

console.log(instanceOfByHand(a, Array)) // true
console.log(instanceOfByHand(b, Array)) // true
console.log(instanceOfByHand(c, Array)) // false
