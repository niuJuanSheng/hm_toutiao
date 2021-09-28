// 封装用户相关接口
import axios from "@/utils/request"

// 封装登录接口  /login  post
export const login = data=>axios({
    url: "/login",
    method: "post",
    data
})

// 封装注册接口 /register post
export const register = data=>axios({
    url: "/register",
    method: "post",
    data
})

// 个人中心接口 /user/:id get
export const personal = (id)=>axios({
    url: `/user/${id}`,
    method: "get"
})

// 上传文件接口 /upload
export const upload = (data)=>axios({
    url: "/upload",
    method: "post",
    data
}) 

// 修改个人信息接口 /user_update/:id 
export const user_update = (id,data)=>axios({
    url: "/user_update/"+id,
    method: "post",
    data
})

// 关注用户（文章的作者）/user_follows/:id
export const user_follows = id=>axios({
    url: "/user_follows/"+id,
    method: "get"
})

// 取消关注用户 /user_unfollow/:id
export const user_unfollow = id=>axios({
    url: "/user_unfollow/"+id,
    method: "get"
})

// 关注的用户列表 /user_follows
export const follow_list = ()=>axios({
    url: "/user_follows",
    method: "get"
})

// 收藏文章列表 /user_star
export const user_star = ()=>axios({
    url: "/user_star",
    method: "get"
})