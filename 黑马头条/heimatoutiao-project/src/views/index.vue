<template>
    <div>
        <!-- 头部 -->
        <van-nav-bar>
            <template #left>
                <span @click="$router.push('/index')" class="iconfont iconnew index-new"></span>
            </template>
            <template #title>
                <div @click="$router.push('/search')" class="index-header-search">
                    <van-icon name="search" color="#fff" size="20" />
                    搜索商品
                </div>
            </template>
            <template #right>
                <van-icon @click="$router.push('/personal')" name="manager-o" color="#fff" size="25" />
            </template>
        </van-nav-bar>
        <!-- 
            内容 
            通过v-model设置默认选中的栏目
        -->
        <van-tabs @click.native="toPage" v-model="curIndex" @change="getCategoryData">
            <van-tab v-for="item in categoryList" :title="item.name" :key="item.id+1">
                <!-- 
                    新闻有三种类型的展示方式：
                    1、左右结构
                    2、上下结构，上面试标题，下面是3张图片
                    3、上下结构，上标题，下面是视频
                 -->
                 <!-- 
                     van-pull-refresh 下拉刷新数据
                     v-model 设置为 false，表示加载完成，
                     下拉的时候v-model绑定的值自动会变为true，因此加载完成后需要我们手动设置回false
                     refresh: 当用户下拉页面的时候触发的函数，那么我们可以在这个事件的事件处理函数中进行数据更新

                 -->
                 <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                     <!-- 
                         上拉加载更多数据
                         v-model绑定的变量，表示当前的加载状态
                         finished：所有数据加载完成的状态，如果全部加载完成，需要将其设置为true
                         load事件：上拉加载的时候会触发的事件
                     -->
                     <van-list
                        v-model="loading"
                        :finished="finished"
                        :immediate-check="false"
                        finished-text="没有更多了"
                        @load="onLoad"
                        >
                        <!-- 
                            修饰符native
                            作用：使得在组件中也可以使用原生事件
                         -->
                        <hmArticleItem @click.native="toDetal(item.id)" v-for="item in newsList" 
                        :key="item.id" :obj="item"></hmArticleItem>
                     </van-list>
                 </van-pull-refresh>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
import hmArticleItem from "@/components/hmArticleItem.vue"
import { category,post } from "@/api/index"
export default {
    components: {hmArticleItem},
    data(){
        return {
            categoryList: [],   // 栏目列表
            newsList: [],       // 新闻列表
            isLoading: false,   // 下拉刷新的状态
            // curIndex的初始需要根据是否登录来进行设置，如果登录了初始值为1，否则0
            curIndex: this.$route.meta.curIndex,  // 当前栏目的下标值
            loading: false,     // 上拉加载的状态
            finished: false,     // 上拉加载，用于设置所有数据加载完成后的状态
            pageIndex: 1,       // 请求文章的当前页数
            pageSize: 10,       // 每一页请求的新闻数量
        }
    },
    async created(){
        // 获取栏目列表，当缓存中有栏目列表的时候，直接从缓存中获取 ，否则请求
        if(localStorage.getItem("categoryList")){
            // 存在
            let defaultCate = JSON.parse( localStorage.getItem("defaultCategoryList") )
            let categoryList = JSON.parse( localStorage.getItem("categoryList") )
            this.categoryList = [ ...defaultCate, ...categoryList ]
            // 判断用户是否登录，且之前是否已经缓存过来登录后的栏目列表，如果没有，则进行请求把“关注”栏目拼接到数组中。
            if(localStorage.getItem("hm-token-67")&&defaultCate.length==1){
                let res = await category();
                this.categoryList = [res.data.data[0],...this.categoryList];
            }else{
                // 未登录，且已经保存了“关注”栏目
                !localStorage.getItem("hm-token-67")&&this.categoryList.splice(0,1);
            }
        }else{
            let res = await category();
            this.categoryList = res.data.data;
        }

        // 获取栏目对应的新闻列表
        this.getNews()
        // post({
        //     category: this.categoryList[this.curIndex].id,
        //     pageIndex: this.pageIndex,
        //     pageSize: this.pageSize
        // }).then(res=>{
        //     // 默认请求回来10条数据
        //     console.log(49,res);
        //     this.newsList = res.data.data;
        // })
    },
    methods: {
        // 跳转到栏目页面
        toPage(e){
            if(e.target.className.indexOf("van-tabs__wrap") != -1){
                this.$router.push("/category")
            }
        },
        // 点击新闻列表项，跳转到新闻详情页面
        toDetal(id){
            console.log(97);
            this.$router.push({
                path:　"/newsDetail",
                query: {
                    id
                }
            })
        },
        // 上拉加载时触发的函数
        onLoad(){
            // 执行程序，立刻会执行一次此函数
            console.log(666);
            this.pageIndex++;
            this.getNews()
        },
        // 下拉新闻列表的时候触发的函数
        onRefresh(){
            this.newsList = [];
            this.pageIndex = 1;
            this.finished = false;
            this.getNews()
        },
        // 点击栏目 切换显示的数据
        getCategoryData(name,title){
            // name是 栏目列表的下标值
            console.log(name,title);
            // 通过下标值获取到点击栏目对象的id
            // console.log(this.categoryList[name].id);
            // 根据栏目id请求数据
            this.curIndex = name; // 保存当前栏目的下标值
            // // 将下标值保存到路由元信息中
            this.$route.meta.curIndex = this.curIndex;
            this.newsList = [];
            // 初始化数据
            this.pageIndex = 1;
            this.finished = false;
            this.getNews()
        },
        // 封装获取新闻列表的函数
        getNews(){
            // 添加加载条
            this.$toast.loading({
                message: '加载中...',
                forbidClick: true,
                loadingType: 'spinner',
                duration: 5000
            });
            post({
                category: this.categoryList[this.curIndex].id,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            }).then(res=>{
                // 关闭加载条
                this.$toast.clear()
                // 默认请求回来10条数据
                console.log(49,res);
                // 下拉刷新完成后，需要将isLoading设置回false
                this.isLoading = false;
                // 上拉加载更多，需要将loading变false
                this.loading = false;
                // 上拉加载完成所有数据之后，需要将finished设置为true
                // 当请求回来的数据数量少于每次请求的数量的时候说明，没有更多数据了
                if(res.data.data.length<this.pageSize){
                    this.finished = true;
                }
                // 加载更多的时候，需要合并之前的数据
                this.newsList = [...this.newsList,...res.data.data];
            })
        }
    }
}
</script>

<style lang="less" scoped>
.van-nav-bar{
    background-color: red;
}
.index-new{
    font-size: 50px;
    color: #fff;
}
/deep/.van-nav-bar__title{
    width: 60%;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 35px;
    color: #fff;
    height: 38px;
    line-height: 38px;
}
// 新闻列表布局
.single {
  padding: 15px 0px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  flex-wrap: wrap;
  .left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    overflow: hidden;
    .content {
      font-size: 14px;
      padding: 0px 5px;
      line-height: 24px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .info {
    font-size: 12px;
    padding-left:5px;
    color: #999;
    > span:nth-of-type(1) {
      padding-right: 15px;
    }
  }
  img {
    width: 120/360 * 100vw;
    height: 70/360 * 100vw;
    object-fit: cover;
    padding-right: 5px;
  }
}
// 添加加号
/deep/.van-tabs__wrap{
    padding-right: 44px;
    &::after{
        content: "+";
        position: absolute;
        width: 44px;
        height: 44px;
        font-size: 30px;
        background-color: #fff;
        top: 0;
        right: 0;
        text-align: center;
        line-height: 44px;
    }
}

</style>