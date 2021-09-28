import Vue from 'vue'
import App from './App.vue'
import "./styles/index.less"
// 6、引入路由对象
import router from "./router/index"
import axios from "./utils/request"

Vue.config.productionTip = false
// vant组件库 自动按需引入
import {Grid, GridItem,SwipeCell,List, PullRefresh,Button, Toast,Cell,NavBar,Icon, Uploader,Dialog,Field,ActionSheet,Tab,Tabs } from 'vant';
Vue.use(Button);
Vue.use(Toast);
Vue.use(Cell);
Vue.use(NavBar);
Vue.use(Icon);
Vue.use(Uploader);
Vue.use(Dialog);
Vue.use(Field);
Vue.use(ActionSheet);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(PullRefresh);
Vue.use(List);
Vue.use(SwipeCell);
Vue.use(Grid);
Vue.use(GridItem);

// 全局过滤器，格式化时间
Vue.filter("formatDate",(val)=>{
  if(!val){return val}
  return val.toLocaleDateString()
})

// 全局过滤器，自动拼接路径
Vue.filter("joinPath",(val)=>{
  if(!val){return val}
  if(val.indexOf("http") != -1){
    // 判断已经有全路径了，直接返回
    return val
  }else{
    // 没有全路径，进行拼接
    return axios.defaults.baseURL + val
  }
})

// 添加导航守卫，有些页面是需要登录后才能访问的，个人中心，个人信息编辑页面
let arr = [ "/personal", "/edit_profile" ]
router.beforeEach((to,from,next)=>{
  let token = localStorage.getItem("hm-token-67");
  if( arr.indexOf(to.path) != -1  &&!token){
    next("/login") // 跳转到登录页面
  }else{
    next()
  }
})

// 7、注入路由对象
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')