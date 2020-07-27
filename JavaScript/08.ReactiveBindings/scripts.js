/**
 * File: scripts.js
 * Created Date: 2020-07-15  11:02:47 am
 * Author: Bo.Jin
 * -----
 * Last Modified: Bo.Jin
 * Modified By: 2020-07-15 21:51:30 pm
 * -----
 * Copyright (c) 2020 ZDWW
 * ------------------------------------
 * -----
 * HISTORY:
 * Date      	 By	Comments
 * ----------	---	----------------------------------------------------------
 */

// https://github.com/vuejs/vue/blob/8ead9d2a0d4ca686eaf5e35526eff4af1b8c79a7/dist/vue.js#L1036

function defineReactive(data, key, value) {
  //递归调用，监听所有属性
  observer(value);
  var dep = new Dep();
  Object.defineProperty(data, key, {
    get: function () {
      if (Dep.target) {
        dep.addSub(Dep.target);
      }
      return value;
    },
    set: function (newVal) {
      if (value !== newVal) {
        value = newVal;
        dep.notify(); //通知订阅器
      }
    },
  });
}

function observer(data) {
  if (!data || typeof data !== "object") {
    return;
  }
  Object.keys(data).forEach((key) => {
    defineReactive(data, key, data[key]);
  });
}

function Dep() {
  this.subs = [];
}
Dep.prototype.addSub = function (sub) {
  this.subs.push(sub);
};
Dep.prototype.notify = function () {
  console.log("属性变化通知 Watcher 执行更新视图函数");
  this.subs.forEach((sub) => {
    sub.update();
  });
};
Dep.target = null;

function Watcher(vm, prop, callback) {
  this.vm = vm;
  this.prop = prop;
  this.callback = callback;
  this.value = this.get();
}
Watcher.prototype = {
  update: function () {
    const value = this.vm.$data[this.prop];
    const oldVal = this.value;
    if (value !== oldVal) {
      this.value = value;
      this.callback(value);
    }
  },
  get: function () {
    Dep.target = this; //储存订阅器
    const value = this.vm.$data[this.prop]; //因为属性被监听，这一步会执行监听器里的 get方法
    Dep.target = null;
    return value;
  },
};
class Compile {
  constructor(vm) {
    this.vm = vm;
    this.el = vm.$el;
    this.fragment = null;
    this.init();
  }

  init () {
    this.fragment = this.nodeFragment(this.el);
  }

  compileNode: function (fragment) {
    let childNodes = fragment.childNodes;
    [...childNodes].forEach((node) => {
      let reg = /\{\{(.*)\}\}/;
      let text = node.textContent;
      if (this.isElementNode(node)) {
        this.compile(node); //渲染指令模板
      } else if (this.isTextNode(node) && reg.test(text)) {
        let prop = RegExp.$1;
        this.compileText(node, prop); //渲染{{}} 模板
      }

      //递归编译子节点
      if (node.childNodes && node.childNodes.length) {
        this.compileNode(node);
      }
    });
  }
nodeFragment (el) {
    const fragment = document.createDocumentFragment();
    let child = el.firstChild;
    //将子节点，全部移动文档片段里
    while (child) {
      fragment.appendChild(child);
      child = el.firstChild;
    }
    return fragment;
  }
  
  compile (node) {
    let nodeAttrs = node.attributes;
    [...nodeAttrs].forEach((attr) => {
      let name = attr.name;
      if (this.isDirective(name)) {
        let value = attr.value;
        if (name === "v-model") {
          this.compileModel(node, value);
        }
        node.removeAttribute(name);
      }
    });
  }
}

function Mvue(options) {
  this.$options = options;
  this.$data = options.data;
  this.$el = document.querySelector(options.el);
  observer(this.$data);
  new Compile(this);
}
