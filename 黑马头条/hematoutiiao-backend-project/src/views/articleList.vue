<template>
  <div>
    <!--面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index/home' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item><a>文章管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>文章列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card 卡片组件 有阴影效果 -->
    <el-card class="box-card">
      <!-- 
          表格
          data: 接收表格数据
          label：用来设置表头的标题
          prop：对应是需要渲染到表格中数据的属性名
     -->
      <el-table height="calc( 100vh - 230px )" :data="tableData" border style="width: 100%">
        <el-table-column label="序号" width="80">
            <!-- 获取到下标值+1进行渲染 -->
            <template v-slot="{$index}">
                {{ $index+1 }}
            </template>
        </el-table-column>
        <el-table-column prop="title" label="标题">
        </el-table-column>
        <el-table-column prop="type" label="类型" width="80">
            <!--  我们需要拿到组件内部的变量来使用 -->
             <template v-slot="{ row }">
                 {{ row.type==1?'文章':'视频' }}
             </template>
        </el-table-column>
        <el-table-column prop="user.nickname" label="作者" width="180"> </el-table-column>
        <el-table-column label="操作" width="160">
            <template v-slot="{row}">
                <el-button size="mini" @click="editFn(row.id)">编辑</el-button>
                <el-button size="mini" type="danger">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { articleList } from "@/api/article.js"
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
        pageIndex: 1,  // 当前页码
        pageSize: 5,   // 每页显示的文章数量
        total: 0,      // 文章总数量
    };
  },
  created(){
    //   获取文章列表
      this.getArticleList()
      // 获取文章总数量
        articleList({
            pageIndex: this.pageIndex,
            pageSize: 10000000
        }).then(res=>{
            this.total = res.data.data.length;
        })
  },
  methods: {
    // 编辑
    editFn(id){
      // 跳转到文章编辑页面（文章添加页面）
      this.$router.push({
        path: "/index/addArticle",
        query:{
          id
        }
      })
    },
    //   pageSize 改变时会触发
      handleSizeChange(number){
        console.log("pageSize",number);
        this.pageSize = number;
        this.getArticleList()
      },
    //   pageIndex 改变时会触发
      handleCurrentChange(currentPage) {
          console.log("pageIndex",currentPage);
          this.pageIndex = currentPage;
            this.getArticleList()
      },
    //   获取文章列表
    getArticleList(){
        articleList({
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
        }).then(res=>{
            console.log(72,res);
            this.tableData = res.data.data;
            if(this.total === 0){
              this.total = res.data.total;
            }
        })
    }
  }
};
</script>

<style lang="less" scoped>
.el-card,.el-pagination {
  margin-top: 20px;
}
</style>