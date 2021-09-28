import axios from "@/utils/request.js"

// 登录接口 post
export const login = data=>axios({
    url: "/login",
    method: "post",
    data
})