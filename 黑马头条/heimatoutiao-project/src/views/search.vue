<template>
    <div>
        <van-nav-bar left-arrow @click-left="$router.back()">
            <template #title>
                <van-field
                    v-model.trim="keyword"
                    clearable
                    left-icon="search"
                    placeholder="请输入关键词搜索"
                />
            </template>
            <template #right>
                <span @click="search">搜索</span>
            </template>
        </van-nav-bar>
        <!-- 历史记录 -->
        <div class="search-list">
            <h1>历史记录</h1>
            <ul>
                <li @click="historySearch(item)" v-for="(item,index) in historyList" :key="index">{{ item }}</li>
            </ul>
        </div>
        <!-- 搜索结果 -->
        <div class="search-list">
            <h1>搜索结果</h1>
            <ul>
                <li @click="toNewsDetail(item.id)" v-for="item in list" :key="item.id">
                    <a v-html="item.title.replaceAll(keyword, `<em style='color:red;'>${keyword}</em>` )"></a> 
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { post_search } from "@/api/newsDetail"
export default {
    data(){
        return {
            keyword: "",
            list: [],  // 搜索结果
            historyList: JSON.parse(localStorage.getItem("historyList")) || [], // 搜索历史记录
        }
    },
    methods: {
        // 点击历史记录搜索
        historySearch(val){
            this.keyword = val;
            this.search();
        },
        // 跳转到新闻详情页面
        toNewsDetail(id){
            this.$router.push({
                path: "/newsDetail",
                query:{
                    id
                }
            })
        },
        // 搜索
        search(){
            // 去重，把关键词加入历史记录
            if(this.historyList.indexOf(this.keyword) == -1){
                this.historyList.push(this.keyword);
                // 保存历史记录到缓存中
                localStorage.setItem("historyList",JSON.stringify(this.historyList))
            }
            post_search({
                keyword :this.keyword
            }).then(res=>{
                console.log(47,res);
                this.list = res.data.data;
            })
        }
    }
}
</script>

<style lang="less" scoped>
/deep/.van-nav-bar{
    height: 56px;
    border-bottom: 1px solid #ddd;
    .van-nav-bar__content{
        height: 100%;
        line-height: 56px;
    }
}
.van-field{
    border-radius: 20px;
    background-color: #f7f8fa;
    height: 38px;
}
.search-list{
    border-bottom: 1px solid #ddd;
    padding: 0 10px 20px 10px;
    li{
        text-decoration: underline;
        margin-bottom: 10px;
    }
}
</style>