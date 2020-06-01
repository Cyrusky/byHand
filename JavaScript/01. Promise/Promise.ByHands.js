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
 * 为了不污染全局的Promise,我们新定义一个名字, 叫做PromiseByHand
 * @param {*} executor Promise的执行函数
 */
let PromiseByHand = function (executor) {
  if (typeof executor !== 'function') {
    throw TypeError('Promise resolver undefined is not a function.')
  }
  this.status = PENDING
  this.value = undefined
  this.reson = undefined
  this.resolvers = []
  this.rejectors = []
}

/**
 * 添加一个拒绝(rejection) 回调到当前 promise,
 * 返回一个新的promise。当这个回调函数被调用，
 * 新 promise 将以它的返回值来resolve，
 * 否则如果当前promise 进入fulfilled状态，则
 * 以当前promise的完成结果作为新promise的完成结果.
 * @param {*} onRejected
 */
PromiseByHand.prototype.catch = function (onRejected) {
  this.rejectors.push(onRejected)
  if (this.status === REJECTED) {
    this.rejectors.forEach(rejector => {
      rejector(this.reson)
    })
  }
  return this
}

/**
 * 添加解决(fulfillment)和拒绝(rejection)回调到当前 promise,
 * 返回一个新的 promise, 将以回调的返回值来resolve.
 * @param {*} onFulfilled
 * @param {*} onRejected
 */
PromiseByHand.prototype.then = function (onFulfilled, onRejected) {
  if (onFulfilled && typeof onFulfilled === 'function') {
    this.resolvers.push(onFulfilled)
    this.resolvers.forEach(resolver => {
      resolver(this.value)
    })
  } else if (onRejected && typeof onRejected === 'function') {
    this.rejectors.push(onRejected)
    this.rejectors.forEach(rejector => rejector(this.reson))
  }
  return this
}

/**
 * 添加一个事件处理回调于当前promise对象，
 * 并且在原promise对象解析完毕后，
 * 返回一个新的promise对象。
 * 回调会在当前promise运行完毕后被调用，
 * 无论当前promise的状态是完成(fulfilled)还是失败(rejected)
 */
PromiseByHand.prototype.finally = function (onFinally) {}

/**
 * 这个方法返回一个新的promise对象，
 * 该promise对象在iterable参数对象里所有的promise
 * 对象都成功的时候才会触发成功，
 * 一旦有任何一个iterable里面的promise对象失败则立即触发该promise对象的失败。
 * 这个新的promise对象在触发成功状态以后，
 * 会把一个包含iterable里所有promise返回值的数组作为成功回调的返回值，
 * 顺序跟iterable的顺序保持一致；如果这个新的promise对象触发了失败状态，
 * 它会把iterable里第一个触发失败的promise对象的错误信息作为它的失败错误信息。
 * Promise.all方法常被用于处理多个promise对象的状态集合。
 * （可以参考jQuery.when方法---译者注）
 */
PromiseByHand.all = function (iterable) {}

/**
 * 当iterable参数里的任意一个子promise被成功或失败后，
 * 父promise马上也会用子promise的成功返回值或失败详情作为
 * 参数调用父promise绑定的相应句柄，并返回该promise对象。
 */
PromiseByHand.race = function (iterable) {}

/**
 * 返回一个状态为失败的Promise对象，并将给定的失败信息传递给对应的处理方法
 */
PromiseByHand.reject = function (reason) {}

/**
 * 返回一个状态由给定value决定的Promise对象。
 * 如果该值是thenable(即，带有then方法的对象)，
 * 返回的Promise对象的最终状态由then方法执行决定；
 * 否则的话(该value为空，基本类型或者不带then方法的对象),
 * 返回的Promise对象状态为fulfilled，
 * 并且将该value传递给对应的then方法。
 * 通常而言，如果你不知道一个值是否是Promise对象，
 * 使用Promise.resolve(value) 来返回一个Promise对象,
 * 这样就能将该value以Promise对象形式使用。
 */
PromiseByHand.resolve = function (value) {}
