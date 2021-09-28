import axios from "@/utils/request.js"

// 文章列表 /post
export const articleList = (params)=>axios({
    url: "/post",
    method: "get",
    params
})

// 发表文章 /post  post
export const publisherArticle = data=>axios({
    url: "/post",
    method: "post",
    data
})

// 文章详情 /post/:id
export const articleDetail = id=>axios({
    url: "/post/"+id
})

// 编辑文章 /post_update/:id
export const post_update = (id,data)=>axios({
    url: "/post_update/"+id,
    method: "post",
    data
})