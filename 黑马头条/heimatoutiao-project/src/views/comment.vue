<template>
    <div>
        <!-- 头部 -->
        <van-nav-bar title="发表评论"  @click-left="$router.back()" left-arrow />
        <!-- 评论列表 -->

        <div class="item" v-for="(item,index) in commnetList" :key="index">
            <div class="head">
                <img src="图片路径" alt />
                <div>
                    <p>发表人</p>
                    <span>时间</span>
                </div>
                <span @click="replyFn(item.id)">回复</span>
            </div>
            <!-- 嵌套的评论 start -->
            <hmCommentItem @replyComFn="replyFn" v-if="item.parent" :obj="item.parent" ></hmCommentItem>
            <!-- 嵌套评论 end -->

            <div class="text">{{item.content}}</div>
        </div>

        <!-- 底部 -->
        <hmComment ref="footerCom" @updateList="updateComment" :newsObj="articleObj"></hmComment>
    </div>
</template>

<script>
import hmComment from "@/components/hmComment.vue"
import { newsDetail,post_comment } from "@/api/newsDetail"
import hmCommentItem from "@/components/hmCommentItem.vue"
export default {
    components: {hmComment,hmCommentItem},
    data(){
        return {
            articleObj: [],  // 文章详情数据
            commnetList: [ {
                content: "内容一",
                parent: {
                    content: "内容二",
                    parent: {
                        content: "我是直接评论文章的，其他都是回复"
                    }
                }
            },{
                content: "2内容一",
                parent: {
                    content: "2内容二",
                }
            } ]
        }
    },
    created(){
        // 请求文章详情/评论列表 数据
        this.init()
    },
    methods: {
        // 回复评论
        replyFn(id){
            console.log(this.$refs.footerCom);
            // 通过ref属性获取到子组件对象，
            // 然后调用其方法和属性来完成传值和通知
            this.$refs.footerCom.showTextarea();
            this.$refs.footerCom.parent_id = id;
        },
        // 更新评论列表
        updateComment(){
            this.init()
        },
        // 获取评论列表数据
        init(){
            // 请求文章详情数据
            let id = this.$route.query.id;
            newsDetail(id).then(res=>{
                console.log(25,res);
                this.articleObj = res.data.data;
            })
            // 请求评论列表数据
            post_comment(id).then(res=>{
                this.commnetList = res.data.data;

                // 滚动到列表顶部
                this.$nextTick(()=>{
                    window.scrollTo(0,0)
                })
            })
            
        }
    }
}
</script>
<style lang="less" scoped>
.item {
    padding: 10px 5px;
    border-bottom: 1px solid #ccc;
    .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        > img {
            width: (50/360) * 100vw;
            height: (50/360) * 100vw;
            display: block;
            border-radius: 50%;
        }
        > div {
            flex: 1;
            display: flex;
            flex-direction: column;
            margin-left: 10px;
            > span {
                font-size: 12px;
                color: #999;
                line-height: 25px;
            }
        }
        > span {
            color: #999;
            font-size: 13px;
        }
    }
    .text {
        font-size: 14px;
        color: #333;
        padding: 20px 0 10px 0;
    }
}

</style>