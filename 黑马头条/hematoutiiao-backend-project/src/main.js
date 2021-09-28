import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from "./router/index"
import "./style/index.less"

Vue.use(ElementUI);
Vue.config.productionTip = false

// 添加导航守卫，所有页面必须登录后才能访问
router.beforeEach((to,form,next)=>{
  let token = localStorage.getItem("hm-token-backend");
  if(to.path !== "/login"&&!token){
    next("/login")
  }else{
    next()
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
