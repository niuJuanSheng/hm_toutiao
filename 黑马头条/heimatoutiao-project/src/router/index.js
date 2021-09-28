import Vue from "vue";
// 1、引入
import VueRouter from "vue-router";
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
// 2、注册 
Vue.use(VueRouter)
// 3、配置路由规则
const routes = [
    {
        path: "/",
        redirect: "/index"
    },
    {
        path: "/login",
        component: ()=>import("@/views/login.vue") // 这种引入方式“按需引入”
    },
    {
        path: "/register",
        component: ()=>import("@/views/register.vue")
    },{
        path: "/personal",
        component: ()=>import("@/views/personal.vue")
    },{// 个人信息编辑
        path: "/edit_profile",
        component: ()=>import("@/views/edit_profile.vue")
    },{
        path: "/index",
        component: ()=>import("@/views/index.vue"),
        meta:{ // 路由元信息，可以保存任何你想保存的内容
            curIndex: localStorage.getItem("hm-token-67")?1:0
        }
    },{
        path: "/newsDetail",
        component: ()=>import("@/views/newsDetail.vue")
    },{
        path: "/myFollow",
        component: ()=>import("@/views/myFollow.vue")
    },{
        path: "/myStar",
        component: ()=>import("@/views/myStar.vue")
    },{
        path: "/comment",
        component: ()=>import("@/views/comment.vue")
    },
    {
        path: "/category",
        component: ()=>import("@/views/category.vue")
    },{
        path: "/search",
        component: ()=>import("@/views/search.vue")
    }
]
// 4、利用路由规则生成路由对象
const router = new VueRouter({
    routes
})

// 5、导入路由对象
export default router