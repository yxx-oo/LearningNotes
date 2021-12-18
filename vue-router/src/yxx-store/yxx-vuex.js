//vuex实现
let Vue

class Store {
  constructor(options) {
    //1.保存选项
    this.$options = options
    this._mutations = options.mutations
    this._actions = options.actions
    this._wrappedGetters = options.getters
    //2.暴露state属性,并对传入的选项做响应式处理
    // Vue.util.defineReactive(this, 'state', this.$options.state);

    //_vm让用户明白不要访问它
    this._vm = new Vue({
      data() {
        return {
          //加上$$为了避免vue对该属性做代理，
          $$state: options.state,
        }
      }
    })

    //绑定上下文，确保是store实例
    this.commit = this.commit.bind(this);
    this.dispatch = this.dispatch.bind(this);
  }
  get state() {
    return this._vm._data.$$state
  }
  set state(v) {
    console.error('fkjdksjfkjdksjfkjsdkfjksdjfks');
  }
  //
  commit(type, payload) {
    const entry = this._mutations[type]
    debugger;
    if (!entry) {
      console.error('no entry**********************');
      return;
    }
    entry(this.state, payload);
  }
  dispatch(type, payload) {
    const entry = this._actions[type]
    debugger;
    if (!entry) {
      console.error('no actons**********************');
      return;
    }
    entry(this, payload);
  }
}

function install(_Vue) {
  Vue = _Vue

  //注册$store
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
  
}

export default { Store, install };