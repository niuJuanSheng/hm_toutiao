// 首页相关接口封装
import axios from "@/utils/request"

// 栏目列表 /category  get
export const category = params=>axios({
    url: "/category",
    method: "get",
    params
})

// 新闻列表 /post
export const post = params=>axios({
    url: "/post",
    method: "get",
    params
})