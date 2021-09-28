import VueRouter from "vue-router";
import Vue from "vue";

// 注册
Vue.use(VueRouter)

// 解决重复点击同一个路由导致报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

// 路由规则
const routes = [
    {
        path: "/",
        redirect: "/login"
    },
    {
        path: "/login",
        component: ()=>import("@/views/login.vue")
    },
    {
        path: "/index",
        component: ()=>import("@/views/index.vue"),
        redirect: "/index/home",
        children:[
            {
                path: "home",
                component: ()=>import("@/views/home.vue")
            },
            {
                path: "articleList",
                component: ()=>import("@/views/articleList.vue")
            },{
                path: "addArticle",
                component: ()=>import("@/views/addArticle.vue")
            }
        ]
    }
]

// 实例化路由对象
 const router = new VueRouter({
     routes
 })

 export default router