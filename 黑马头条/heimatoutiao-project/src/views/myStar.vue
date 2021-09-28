<template>
    <div>
        <van-nav-bar title="我的收藏" @click-left="$router.back()" left-arrow />
        <van-swipe-cell  v-for="(item,index) in starList" :key="item.id">
            <hmArticleItem :obj="item" @click.native="toPage(item.id)"></hmArticleItem>
            <template #right>
                <van-button square text="删除" @click="unstarFn(item.id,index)" type="danger" class="delete-button" />
            </template>
        </van-swipe-cell>
    </div>
</template>

<script>
import hmArticleItem from "@/components/hmArticleItem.vue"
import { user_star } from "@/api/user"
import { post_star } from "@/api/newsDetail"
export default {
    components: { hmArticleItem },
    data(){
        return {
            starList: []
        }
    },
    created(){
        user_star().then(res=>{
            console.log(15,res);
            this.starList = res.data.data;
        })
    },
    methods: {
        // 跳转到文章详情
        toPage(id){
            this.$router.push({
                path: "/newsDetail",
                query: {
                    id
                }
            })
        },
        // 取消收藏，并删除数据
        unstarFn(id,index){
            post_star(id).then(res=>{
                console.log(43,res);
                this.$toast({
                    message: res.data.message
                })
                // 删除数据
                this.starList.splice(index,1);
            })
        }
    }
}
</script>

<style lang="less" scoped>
.van-button{
    height: 100%;
}
</style>