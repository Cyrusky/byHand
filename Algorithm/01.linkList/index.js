/**
 * File: index.js
 * Created Date: 2020-06-01  11:22:16 am
 * Author: Bo.Jin
 * -----
 * Last Modified: Bo.Jin
 * Modified By: 2020-06-01 11:45:34 am
 * -----
 * Copyright (c) 2020 ZDWW
 * ------------------------------------
 * -----
 * HISTORY:
 * Date      	 By	Comments
 * ----------	---	----------------------------------------------------------
 */

let { LinkList } = require('../00.DataStructure/linkList')

let list = new LinkList([1, 2, 3, 4], true)
console.log(list.getValueList())
