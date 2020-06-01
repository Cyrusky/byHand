/**
 * Pending状态标记
 */
const PENDING = Symbol('pending') //初始态
/**
 * FulFilled状态标记
 */
const FULFILLED = Symbol('fulfilled') //初始态
/**
 * Rejected状态标记
 */
const REJECTED = Symbol('rejected') //初始态

/**
 * 该函数是Promise的主要实现函数
 * @param {Function} executor Promise中传入的参数
 */
let myPromise = function (executor) {
  //先缓存当前promise实例, 保存当前示例的一个应用,防止this变化
  let self = this
  //设置初始化
  self.status = PENDING
  //定义存放成功的回调的数组
  self.onResolvedCallbacks = []
  //定义存放失败回调的数组
  self.onRejectedCallbacks = []
  //当调用此方法的时候，如果promise状态为pending,的话可以转成成功态,如果已经是成功态或者失败态了，则什么都不做

  //2.1 定义resolve方法;
  function resolve(value) {
    if (value != null && value.then && typeof value.then == 'function') {
      return value.then(resolve, reject)
    }
    //如果是初始态，则转成成功态
    //为什么要把它用setTimeout包起来
    setTimeout(function () {
      if (self.status === PENDING) {
        self.status = FULFILLED
        self.value = value //成功后会得到一个值，这个值不能改
        //调用所有成功的回调
        self.onResolvedCallbacks.forEach(cb => cb(self.value))
      }
    })
  }
  //2.1.2 定义reject方法;
  function reject(reason) {
    setTimeout(function () {
      //如果是初始态，则转成失败态
      if (self.status == PENDING) {
        self.status = REJECTED
        self.value = reason //失败的原因给了value
        self.onRejectedCallbacks.forEach(cb => cb(self.value))
      }
    })
  }
  try {
    //因为此函数执行可能会异常，所以需要捕获，如果出错了，需要用错误 对象reject
    executor(resolve, reject)
  } catch (e) {
    //如果这函数执行失败了，则用失败的原因reject这个promise
    reject(e)
  }
}
