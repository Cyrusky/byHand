/**
 * File: linkList.js
 * Created Date: 2020-06-01  11:20:59 am
 * Author: Bo.Jin
 * -----
 * Last Modified: Bo.Jin
 * Modified By: 2020-06-01 11:45:08 am
 * -----
 * Copyright (c) 2020 ZDWW
 * ------------------------------------
 * -----
 * HISTORY:
 * Date      	 By	Comments
 * ----------	---	----------------------------------------------------------
 */

class ListNode {
  constructor(value) {
    this.value = value
    this.next = null
  }
}

class LinkList {
  /**
   *
   * @param {*} values
   * @param {*} with_head_node
   */
  constructor(values, with_head_node = true) {
    this.with_head_node = with_head_node
    let tailPointer
    if (!this.with_head_node) {
      this.list = null
      tailPointer = this.list
    } else {
      this.list = new ListNode(null)
      tailPointer = this.list.next
    }
    if (values) {
      if (Array.isArray(values)) {
        values.forEach(value => {
          this.push(value)
        })
      } else {
        this.push(values)
      }
    }
  }
  /**
   *
   * @param {*} value
   */
  push(value) {
    let node = new ListNode(value)
    this.tailPointer.next = node
    this.tailPointer = this.tailPointer.next
  }

  /**
   *
   * @param {*} callback
   */
  traverse(callback) {
    let header = this.with_head_node ? this.list.next : this.list
    while (header) {
      callback(header.value)
      header = header.next
    }
  }
  /**
   *
   */
  getValueList() {
    let res = []
    this.traverse(value => {
      res.push(value)
    })
    return res
  }
}

module.exports = {
  LinkList
}
