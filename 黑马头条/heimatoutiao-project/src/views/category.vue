<template>
    <div>
        <!--  @click-left 是nav-bar组件提供的事件，点击左侧按钮时触发 -->
        <van-nav-bar title="栏目管理" left-arrow @click-left="$router.back()" />
        <div class="categoryBox">
            <h1>点击删除频道</h1>
            <van-grid :gutter="10">
                <van-grid-item @click="delCategory(index)" v-for="(value,index) in categoryList" :key="value.id" :text="value.name" />
            </van-grid>
        </div>
        <div class="categoryBox">
            <h1>点击添加频道</h1>
            <van-grid :gutter="10">
                <van-grid-item @click="addCategory(index)" v-for="(value,index) in delCategoryList" :key="value.id" :text="value.name" />
            </van-grid>
        </div>
    </div>
</template>

<script>
import { category } from "@/api/index"
export default {
    data(){
        return {
            categoryList: [],   // 栏目列表
            delCategoryList: [], // 被删除的栏目列表
            defaultCategoryList: [], // 默认的栏目“关注”，“头条” 不能删除
        }
    },
    watch:{
        // 实时缓存 栏目数据
        categoryList:{
            deep: true,
            handler(){
                localStorage.setItem("defaultCategoryList",JSON.stringify(this.defaultCategoryList))
                localStorage.setItem("categoryList",JSON.stringify(this.categoryList))
                localStorage.setItem("delCategoryList",JSON.stringify(this.delCategoryList))
            }
        }
    },
    created(){
        // 如果缓存中有栏目列表数据，从缓存中获取，否则请求数据
        if(localStorage.getItem("categoryList")){
            this.defaultCategoryList = JSON.parse(localStorage.getItem("defaultCategoryList"));
            this.categoryList = JSON.parse(localStorage.getItem("categoryList"));
            this.delCategoryList = JSON.parse(localStorage.getItem("delCategoryList"));
            return;
        }
        // 请求栏目列表
        category().then(res=>{
            console.log(25,res);
            // 默认的栏目“关注”，“头条” 不能删除，需要从展示列表中删除
            if(localStorage.getItem("hm-token-67")){
                this.defaultCategoryList = res.data.data.slice(0,2);
                this.categoryList = res.data.data.slice(2);
            }else{
                this.defaultCategoryList = res.data.data.slice(0,1);
                this.categoryList = res.data.data.slice(1);
            }
        })
    },
    methods: {
        // 添加栏目
        addCategory(index){
            let res = this.delCategoryList.splice(index,1);
            this.categoryList.push(res[0]);
        },
        // 删除栏目
        delCategory(index){
            let res = this.categoryList.splice(index,1);
            console.log(47,res);
            this.delCategoryList.push(res[0]);
        }
    }
}
</script>

<style lang="less" scoped>
.categoryBox{
    margin-top: 20px;
    h1{
        font-size: 18px;
        padding: 0 10px;
    }
}
</style>