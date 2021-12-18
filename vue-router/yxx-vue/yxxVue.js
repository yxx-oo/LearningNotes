
//实现响应式
//vue2: object.defineProperty(obj,key,desc)
//vue3: new Proxy()
//设置obj的key，拦截，初始值

function defineReactive(obj, key, val) {
  observe(val)
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    get() {
      console.log('get',key);
      Dep.target && dep.addDep(Dep.target)
      return val;
    },
    set(v) {
      if (v !== val) {
        observe(v)
        val = v
        console.log('set',key);
        dep.notify()
      }
    }
  })
}

function observe(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  Object.keys(obj).forEach((key)=>{defineReactive(obj,key,obj[key])})
}

function proxy(vm) {
  Object.keys(vm.$data).forEach(key=>{
    Object.defineProperty(vm,key,{
      get() {
        return vm.$data[key]
      },
      set(v) {
        vm.$data[key] = v
      }
    })
  })
}

class YXXVue {
  constructor(options) {
    //保存选项
    this.$options = options
    this.$data = options.data

    //对data做响应式
    observe(this.$data);

    //代理
    proxy(this)

    //编译
    new Compile(options.el, this)
  }
}

class Compile {
  constructor(el, vm) {
    this.$vm = vm
    this.compile(document.querySelector(el))
  }
  compile(el) {
    el.childNodes.forEach(node=>{
      if (node.nodeType === 1) {
        this.compileElement(node)
        if (node.childNodes.length > 0) {
          this.compile(node)
        }
      } else if (this.isInter(node)) {
        console.log('text', node.textContent);
        this.conpileText(node)
      }
    })
  }
  update(node,exp,dir) {
    const fn = this[dir+'Updater']
    fn && fn(node, this.$vm[exp])
    new Watcher(this.$vm, exp, function(val) {
      fn && fn(node, val)
    })
  }
  conpileText(node) {
    this.update(node, RegExp.$1, 'text')
  }
  textUpdater(node, val) {
    node.textContent = val
  }
  compileElement(node) {
    const nodeAttrs = node.attributes;
    Array.from(nodeAttrs).forEach(attr=>{
      const attrName = attr.name
      const exp = attr.value
      if (attrName.startsWith('y-')) {
        const dir = attrName.substring(2)
        this[dir] && this[dir](node, exp)
      }
    })
  }
  text(node, exp) {
    this.update(node, exp, 'text')
  }
  html(node, exp) {
    this.update(node, exp, 'html')
  }
  htmlUpdater(node, val) {
    node.innerHTML = val
  }
  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
}

class Watcher {
  constructor(vm, key, updateFn) {
    this.vm = vm
    this.key = key
    this.updateFn = updateFn
    Dep.target = this
    vm[key]
    Dep.target = null
  }
  update() {
    this.updateFn.call(this.vm, this.vm[this.key])
  }
}

class Dep {
  constructor() {
    this.deps = []
  }
  addDep(dep) {
    this.deps.push(dep)
  }
  notify() {
    this.deps.forEach(dep=>dep.update())
  }
}