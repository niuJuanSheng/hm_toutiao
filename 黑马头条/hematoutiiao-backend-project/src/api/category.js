import axios from "@/utils/request"

// 获取栏目列表 /category
export const category = ()=>axios({
    url: "/category",
    method: "get"
})