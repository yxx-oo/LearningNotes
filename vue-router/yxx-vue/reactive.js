
//实现响应式
//vue2: object.defineProperty(obj,key,desc)
//vue3: new Proxy()
//设置obj的key，拦截，初始值
function defineReactive(obj, key, val) {
  observe(val)
  Object.defineProperty(obj, key, {
    get() {
      console.log('get',key);
      return val;
    },
    set(v) {
      if (v !== val) {
        observe(v)
        val = v
        console.log('set',key);
      }
    }
  })
}

function set(obj,key,val) {
  defineReactive(obj,key,val)
}

const obj = {
  foo: 'foo',
  bar: 'bar',
  baz: {
    a: 1
  }
}

function observe(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  Object.keys(obj).forEach((key)=>{defineReactive(obj,key,obj[key])})
}
observe(obj)

obj.baz = {
  a: 10
}
obj.baz.a

// obj.text = 'abcdefg'
// obj.text

set(obj,'text','abcdefg')
obj.text