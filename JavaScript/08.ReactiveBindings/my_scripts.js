/**
 * File: my_scripts.js
 * Created Date: 2020-07-15  21:52:16 pm
 * Author: Bo.Jin
 * -----
 * Last Modified: Bo.Jin
 * Modified By: 2020-07-16 16:53:47 pm
 * -----
 * Copyright (c) 2020 ZDWW
 * ------------------------------------
 * -----
 * HISTORY:
 * Date      	 By	Comments
 * ----------	---	----------------------------------------------------------
 */

/**
 * 数据劫持器
 * @param {object} data 一个对象模型
 * @param {string | symbol} key 对象中的键值
 * @param {any} value 对象中的value值
 */
const defineReactive = (data, key, value) => {
  const dep = new Dep();
  observer(value);
  /**
   * 此处的defineProperty实际上是覆盖了原来对象中的 data[key] = value这个字段的
   */
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      // 全局类对象中有一个静态属性, 我们可以用来存放Target的值
      Dep.target && dep.addSub(Dep.target);
      return value;
    },
    set: function (newValue) {
      if (newValue !== value) {
        console.log("在此处触发变更");
        dep.notify();
        value = newValue;
      }
    },
  });
};

/**
 * 观察者生成器, 是一个递归函数
 * @param {Any}} 任意类型数据
 */
const observer = (data) => {
  if (!data || typeof data !== "object") {
    // 如果传入的数据不是一个对象,或者为空,则不去处理它
    return;
  }
  Object.keys(data).forEach((key) => {
    defineReactive(data, key, data[key]);
  });
};

/**
 * 订阅者消息队列维护者
 */
class Dep {
  constructor() {
    this.subs = [];
  }
  get() {
    console.log("获取Dep");
  }
  target = null;

  addSub(watcher) {
    this.subs.push(watcher);
  }

  notify() {
    this.subs.forEach((sub) => {
      sub.update();
    });
  }
}

class Watcher {
  constructor(vm, exp, cb) {
    this.cb = cb;
    this.vm = vm;
    this.exp = exp;
    this.value = this.get();
  }

  update() {
    let value = this.get();
    var oldVal = this.value;
    if (value !== oldVal) {
      this.value = value;
      this.cb.call(this.vm, value, oldVal);
    }
  }

  get() {
    Dep.target = this;
    let value = this.value[this.exp];
    Dep.target = null;
    return value;
  }
}

class MyVue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;
    this.$el = document.querySelector(options.el);
    observer(this.$data);
    this.init();
  }

  init() {}
}
