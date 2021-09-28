<template>
<div class="comment">
    <div class="addcomment" v-show='!isFocus'>
        <input type="text" placeholder="写跟帖" @focus="showTextarea" />
        <span class="comment" @click="toComment">
            <i class="iconfont iconpinglun-"></i>
            <!-- 评论数量 -->
            <em>{{ newsObj.comment_length }}</em> 
        </span>
        <i class="iconfont iconshoucang" :class="{red: newsObj.has_star}" @click="starFn"></i>
        <i class="iconfont iconfenxiang"></i>
    </div>
    <div class="inputcomment" v-show='isFocus'>
        <textarea v-model="content" ref='commtext' rows="5"></textarea>
        <div>
            <span @click="sendComment">发 送</span>
            <span @click="cancelFn">取 消</span>
        </div>
    </div>
</div>
</template>

<script>
import { post_star,publisher_comment } from "@/api/newsDetail"
export default {
    props: [
        "newsObj"
    ],
    data(){
      return {
        isFocus: false,
        content: "",   // 用户评论内容
        parent_id: "" // 回复时用到parent_id
      }
    },
    methods: {
      // 取消发表评论
      cancelFn(){
        this.isFocus = false;
        this.content = "";
        this.parent_id = "";
      },
      // 发表评论
      sendComment(){
        console.log(this.content)
        let data = {
          content: this.content   // 评论内容
        }
        if(this.parent_id){
          data.parent_id = this.parent_id;
        }
        // 发表评论
        publisher_comment( this.newsObj.id, data ).then(res=>{
          console.log(41,res)
          // 提示
          this.$toast({
            message: res.data.message
          })
          // 通知父组件，刷新评论列表(子传父)
          this.$emit("updateList");
          // 隐藏评论块
          this.isFocus = false;
          // 清空用户输入的内容
          this.content = "";
          this.parent_id = "";
        })
      },
      // 显示多行文本域
      showTextarea(){
        this.isFocus = true;
        //文本域自动获取焦点
        this.$nextTick(()=>{
          this.$refs.commtext.focus()
        })
      },
      // 收藏文章、取消收藏
      starFn(){
        post_star(this.newsObj.id).then(res=>{
          console.log(33,res);
          this.newsObj.has_star = !this.newsObj.has_star;
          this.$toast({
            message: res.data.message
          })
        })
      },
      // 跳转到评论页面
      toComment(){
        this.$router.push({
          path: "/comment",
          query: {
            id: this.newsObj.id
          }
        })
      }
    }
}
</script>

<style lang="less" scoped>
.comment{
    position: fixed;
    bottom: 0;
    width: 100%;
}
.inputcomment{
    padding: 10px;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    background-color: #fff;
    align-items: flex-end;
    textarea{
        flex: 3;
        background-color: #eee;
        border:none;
        border-radius: 10px;
        padding: 10px;
    }
    div{
        padding: 20px;
    }
    span {
        display: block;
        flex: 1;
        height: 24px;
        line-height: 24px;
        padding: 0 10px;
        background-color: #f00;
        color:#fff;
        text-align: center;
        border-radius: 6px;
        font-size: 13px;
    }
}
.addcomment {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  margin-top: 20px;
  display: flex;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
    background-color: #fff;
  > input {
    flex: 4;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    border: none;
    background-color: #eee;
    padding-left: 20px;
    font-size: 14px;
  }
  i {
    font-size: 20px;
  }
  > span {
    flex: 1;
    position: relative;
    > em {
      position: absolute;
      right: 0;
      top: -5px;
      font-size: 10px;
      background-color: #f00;
      color: #fff;
      border-radius: 5px;
      padding: 3px 5px;
    }
  }
  > i {
    flex: 1;
  }
}
.red{
  color: red;
}
</style>