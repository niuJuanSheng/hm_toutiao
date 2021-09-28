<template>
    <div class="commentItem">
        <!-- 递归组件 -->
        <div class="top">
            <div class="left">
                <span>发表人</span> &nbsp;&nbsp;&nbsp;
                <span>2分钟前</span>
            </div>
            <span @click="replyFn(obj.id)">回复</span>
        </div>
        <!-- 递归的评论 start -->
            <!-- <div class="commentItem">
                <div class="top">
                    <div class="left">
                        <span>发表人</span> &nbsp;&nbsp;&nbsp;
                        <span>2分钟前</span>
                    </div>
                    <span>回复</span>
                </div>
                <div class="bottom">{{obj.parent.content}}</div>
            </div> -->
            <hmCommentItem v-if="obj.parent" :obj="obj.parent" @replyComFn="replyFn" > </hmCommentItem>

            <!-- 递归的评论 end -->
            
        <div class="bottom">{{obj.content}}</div>
    </div>
</template>

<script>
export default {
    name: "hmCommentItem", // 直接将name属性的值，可以当成标签使用引用自身组件，从而实现递归组件
    props: ["obj"],
    methods: {
        replyFn(id){
            // 子传父
            this.$emit("replyComFn",id)
        }
    }
}
</script>

<style lang="less" scoped>
.commentItem {
  border: 1px solid #ccc;
  padding: 5px;
  margin-top: 10px;
  .top {
    font-size: 12px;
    color: #aaa;
    display: flex;
    justify-content: space-between;
  }
  .bottom {
    font-size: 13px;
    line-height: 40px;
  }
}
</style>