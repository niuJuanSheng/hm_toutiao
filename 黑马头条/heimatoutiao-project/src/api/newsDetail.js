// 新闻文章详情
import axios from "@/utils/request"

// 获取文章详情接口 /post/:id
export const newsDetail = id=>axios({
    url: "/post/"+id,
    method: "get"
})

// 点赞文章功能 /post_like/:id

export const post_like = id=>axios({
    url: "/post_like/"+id,
    method: "get"
})

// 收藏文章 /post_star/:id
export const post_star = id=>axios({
    url: "/post_star/"+id,
    method: "get"
})

// 评论列表 /post_comment/:id
export const post_comment = id=>axios({
    url: "/post_comment/"+id,
    method: "get"
})

// 发表评论接口 /post_comment/:id POST
export const publisher_comment = (id,data)=>axios({
    url: "/post_comment/"+id,
    method:"post",
    data
})

// 搜索文章 /post_search
export const post_search = params=>axios({
    url: "/post_search",
    method: "get",
    params
})