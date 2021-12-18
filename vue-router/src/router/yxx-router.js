import Link from './yxx-routerLink'
import View from './yxx-routerView'

let Vue;
// 先声明插件
class VueRouter {
  constructor(options) {
    //1.保存路由选项
    this.$options = options
    //给current初始值
    // this.current = window.location.hash.slice(1) || '/';
    //如何让current成为一个响应式数据，让render函数重新调用，就可以切换页面
    // Vue.util.defineReactive(this, 'current', window.location.hash.slice(1) || '/')
    debugger;
    this.current = window.location.hash.slice(1) || '/'
    Vue.util.defineReactive(this, 'matched', [])
    //match方法可以递归的遍历路由表,获得匹配关系的数组
    this.match()
    //2.监控url的变化
    window.addEventListener('hashchange', this.onHashChange.bind(this))
    window.addEventListener('load', this.onHashChange.bind(this))
    // 创建一个路由映射表
    // this.routeMap = {}
    // options.routes.forEach(route => {
    //   this.routeMap[route.path] = route
    // })
  }
  onHashChange() {
    this.current = window.location.hash.slice(1);
    this.matched = [];
    this.match();
  }
  match(routes) {
    routes = routes || this.$options.routes
    //递归
    for (const route of routes) {
      if (route.path === '/' && this.current === '/') {
        this.matched.push(route)
        return
      }
      if (route.path !== '/' && this.current.indexOf(route.path) != -1) {
        this.matched.push(route)
        if (route.children) {
          this.match(route.children)
        }
      }
    }
  }
}
VueRouter.install = function (_Vue) {
  //传入一个vue的构造函数，目的就是为了后面可以扩展
  Vue = _Vue;
  //1.注册$router，让所有组件实例都可以访问$router
  //此时router无法获取，vue都还没有构建完成，install的方法就已经执行了( vue.use(router) )
  //所以做延迟执行，等到router实例和vue实例都创建完毕以后执行
  //混入vue.mixin({})
  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        //如果存在说明是根实例
        Vue.prototype.$router = this.$options.router
      }
    }
  });
  //2.注册两个全局组件，router-link，router-view
  Vue.component('router-link', {
    props: {
      to: {
        type: String,
        required: true
      }
    },
    render(h) {
      //h是render函数调用时，框架传入createElement
      //等同于react中createElement,返回vdom
      // return <a href={'#'+this.to}>{this.$slots.default}</a>   这种写法需要jss环境,不通用
      return h('a', {
        attrs: {
          href: "#" +this.to
        }
      }, this.$slots.default);
    }
  });
  // Vue.component("router-view", {
  //   // vue.runtime.js
  //   // vue.js compiler -> template -> render()
  //   // template: '<div>router-view</div>'
  //   render(h) {
  //     // 可以传入一个组件直接渲染
  //     // 思路：如果可以根据url的hash部分动态匹配这个要渲染的组件
  //     // window.location.hash
  //     // console.log(this.$router.$options.routes);
  //     // console.log(this.$router.current);
  //     let component = null;
  //     const route = this.$router.$options.routes.find(
  //       (route) => route.path === this.$router.current
  //     );
  //     if (route) {
  //       component = route.component
  //     }
  //     return h(component);
  //   },
  // });

  Vue.component('router-view', View);
}

export default VueRouter;