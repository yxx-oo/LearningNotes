export default {
  render(h) {
    //标记当前routerview的深度
    this.$vnode.data.routerView = true;
    let depth = 0;
    let parent = this.$parent;

    while (parent && parent._routerRoot !== parent ) {
      const vnodeData = parent.$vnode ? parent.$vnode.data : {};
      debugger;
      if (vnodeData) {
        if (vnodeData.routerView) {
          depth++;
        }
      }
      parent = parent.$parent
    }

    //获取path对应的component
    // const { routeMap, current } = this.$router;
    // console.log( routeMap, current );
    // const component = routeMap[current].component || null;

    let component = null;
    const route = this.$router.matched[depth]
    if (route) {
      component = route.component
    }
    debugger;
    return h(component)
  }
}