<template>
    <div>
        <!--面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item><a>文章管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>文章添加</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <!-- 
                model：表单数据对象 
                    注意：model的值form和v-model绑定的form是同一个对象
                
            -->
            <el-form ref="form" :model="form" label-width="80px">
            <!-- 1、标题 -->
                <el-form-item label="标题">
                    <el-input v-model.trim="form.title"></el-input>
                </el-form-item>
            <!-- 2、类型 -->
                <el-form-item label="类型">
                    <el-radio-group v-model="form.type">
                        <el-radio :label="1">文章</el-radio>
                        <el-radio :label="2">视频</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 3、内容 -->
                <el-form-item label="内容">
                    <!-- type=1 富文本 -->
                    <VueEditor v-show="form.type==1" ref="vueEditor" :config="config"/>
                    <!-- type=2 上传视频的按钮 :on-exceed="handleExceed" -->
                    <el-upload
                        v-show="form.type==2"
                        class="upload-demo"
                       :action="baseURL+'/upload'"
                        :headers= "{ Authorization: token }"
                        :on-success="successFn"
                        :on-remove="removeFn"
                        :on-exceed="handleExceed"
                        :file-list="videoContent"
                        :limit="1">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传视频文件</div>
                    </el-upload>
                </el-form-item>
                <!-- 4、栏目 -->
                <el-form-item label="栏目">
                    <!-- 
                        indeterminate：表示不确定状态，也就是只选中了一部分的选项，此时称为不确定状态
                        change: 当全选框状态发生改变的时候触发的事件
                     -->
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <!-- v-model 绑定的变量值就是选中的内容,选中内容为label属性的值 -->
                    <el-checkbox-group v-model="form.categories" @change="handleCheckedCitiesChange">
                        <el-checkbox v-for="item in categoryList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <!-- 5、封面 -->
                <el-form-item label="封面">
                    <el-upload
                        :action="baseURL+'/upload'"
                        :headers= "{ Authorization: token }"
                        :limit="3"
                        :on-success="coverSuccessFn"
                        :on-exceed="coverhandleExceed"
                        :on-remove="coverRemoveFn"
                        :file-list="form.cover"
                        list-type="picture-card">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <!-- 6、发表文章按钮 -->
            <el-button type="success" @click="publisherFn" >发表文章</el-button>
        </el-card>
    </div>
</template>

<script>
import VueEditor from "vue-word-editor";
import "quill/dist/quill.snow.css"
import { category } from "@/api/category"
import { publisherArticle,articleDetail,post_update } from "@/api/article"
import axios from "@/utils/request.js"
export default {
    components: { VueEditor },
    data(){
        return {
            baseURL: axios.defaults.baseURL,
            token: localStorage.getItem("hm-token-backend"),
            form: {
                title: "",  // 标题
                type: 1,    // 类型
                content: "", // 内容
                categories: [], // 用户选中的栏目id集合
                cover: [],      // 封面集合
            },
            videoContent: [], // 视频
            config: {
                // 上传图片的配置
                uploadImage: {
                    url: axios.defaults.baseURL+"/upload",
                    name: "file",
                    headers:{ Authorization: localStorage.getItem("hm-token-backend") },
                    // res是结果，insert方法会把内容注入到编辑器中，res.data.url是资源地址
                    uploadSuccess(res, insert){
                        console.log(65,res);
                        insert(axios.defaults.baseURL + res.data.data.url)
                    }
                }
            },
            // 栏目 star
            checkAll: false,
            categoryList: [],
            isIndeterminate: false
            // 栏目 end
        }
    },
    created(){
        /***
         * 目标1： 渲染文章详情数据
         * 1、从文章列表跳转到文章新增页面，并传文章id
         * 2、在文章新增页面，通过路由获取传过来的文章id
         * 3、封装文章详情接口
         * 4、根据文章id获取文章详情数据
         * 5、将文章详情数据渲染到页面上
         *     5-1、文章标题和类型的渲染，this.form = 请求回来的数据
         *     5-2、内容的渲染单独处理（富文本内容和视频内容）
         *     5-3、设置栏目
         *     5-4、封面的处理
         *           给upload组件添加file-list属性用于显示详情的图片
         *          改成数据，给详情图片的url拼接基础路径
         * 
         * 目标2：修改文章内容
         *        直接修改封面的话会报错，因此我们需要解决这个问题
         *         1、在移除封面的处理函数中，获取图片id的方式需要修改
         *              修改为 id = file.id || file.response.data.id;
         *         2、回先自己重新上传的图片，显示也会有问题，因为路径没有基础地址
         *              因此需要在图片上传成功后，自己拼接图片的基础路径
         *              response.data.url = this.baseURL + response.data.url;
         *         用户自己上传第二图片的时候 报key重复的错误，如何解决？
         *             因为我们给upload组件添加了file-list属性后，内部拿uid作为key值，uid是唯一用户id，因此会报错
         *             解决：直接删除uid属性即可
         *                   delete 被删除属性
         * 
         * */ 

        // 获取文章详情
        let id = this.$route.query.id;
        if(id){
            // 文章id存在的时候 请求文章详情
            articleDetail(id).then(res=>{
                console.log(125,res);
                this.form = res.data.data;

                // 设置富文本内容
                if(this.form.type==1){
                    this.$nextTick(()=>{
                        var quill = this.$refs.vueEditor.editor; 
                        quill.clipboard.dangerouslyPasteHTML(0, this.form.content );
                    })
                }else {
                    // 设置视频的内容
                    this.videoContent = [ { url: this.form.content } ];
                }
                // 设置选中栏目
                this.form.categories = this.form.categories.map(item=>{
                    return item.id
                })
                // 封面
                this.form.cover.forEach(item=>{
                    delete item.uid;
                    if(item.url.indexOf("http") ==-1){
                        item.url = this.baseURL + item.url
                    }
                })
            })
        }

        // 获取栏目列表
        category().then(res=>{
            console.log(108,res);
            // 栏目不需要“关注”和“头条”
            this.categoryList = res.data.data.slice(2);
        })
    },
    methods:{
        // 封面
        // 删除封面
        coverRemoveFn(file, fileList){
            console.log(179,file)
            let id = file.id || file.response.data.id;
            this.form.cover = this.form.cover.filter(item=>{
                return id != item.id
            })
        },
        // 上传图片超出规定的时候触发
        coverhandleExceed(){
            this.$message({
                message: "图片数量不能超过3张",
                type: "warning"
            })
        },
        // 封面上传成功的时的回调，用来保存数据
        coverSuccessFn(response){
            console.log(125,response.data);
            // 保存整个对象
            delete response.data.uid; // delete方法用来删除对象中属性
            response.data.url = this.baseURL + response.data.url;
            this.form.cover.push(response.data);
        },
        // 栏目
        handleCheckAllChange(val) {
            console.log("全选",val);
            // map方法是数组的方法，专门用来处理数组中的数据，会返回一个处理后的数组，不改变原始数组。
            this.form.categories = val ? this.categoryList.map(item=>item.id) : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            console.log("小选框 被选中的数组",value);
            // 小选影响全选
            this.checkAll = value.length === this.categoryList.length;
            // 设置不确定状态的值
            this.isIndeterminate = value.length>0&&value.length<this.categoryList.length;
        },
        // 删除视频时触发，此时需要清空videoContent对象
        removeFn(){
            this.videoContent = [];
        },
        // 上传视频个数超出规定时触发
        handleExceed(){
            this.$message({
                message: "视频只能上传一个！",
                type: "warning"
            })
        },
        // 视频上传成功
        successFn(response){
            console.log(response.data);
            this.videoContent = [response.data];
        },
        // 发表文章
        publisherFn(){
            console.log(72,this.$refs.vueEditor.editor.root.innerHTML);
            // 判段标题
            if(!this.form.title){
                this.$message({
                    message: "标题不能为空！",
                    type: "warning"
                })
                return
            }
            // 收集富文本内容
            if(this.form.type == 1){
                this.form.content = this.$refs.vueEditor.editor.root.innerHTML;
                // console.log(194,this.$refs.vueEditor.editor.getLength());
                // 当富文本内容为空的时候，可以使用getLength方法获取到内容长度，
                // 长度为1时表示内容为空。
                if(this.$refs.vueEditor.editor.getLength() === 1){
                    this.$message({
                        message: "富文本内容不能为空！",
                        type: "warning"
                    })
                    return
                }
            }else{
                // 视频路径
                this.form.content = axios.defaults.baseURL +  this.videoContent[0].url;
                if(this.videoContent.length==0){
                    this.$message({
                        message: "内容不能为空！",
                        type: "warning"
                    })
                    return
                }
            }
            // 栏目 [{id: 1},{id: 2}]
            this.form.categories = this.form.categories.map(id=>{
                return { id: id}
            })
            if(this.form.categories.length==0){
                this.$message({
                    message: "栏目至少选择一个！",
                    type: "warning"
                })
                return
            }
            // 封面 
            // 深拷贝
            let query = JSON.stringify(this.form);
            query = JSON.parse(query);
            query.cover = query.cover.map(item=>{
                return {id: item.id}
            })
            if(this.form.cover.length==0){
                this.$message({
                    message: "封面至少上传一张！",
                    type: "warning"
                })
                return
            }
            if(this.$route.query.id){
                // 编辑文章
                post_update(this.$route.query.id,query).then(res=>{
                    console.log(303,res);
                    let type = "error";
                    if(res.data.message == "文章编辑成功"){
                        // 跳转文章列表
                        this.$router.push("/index/articleList")
                        type = "success"
                    }
                    this.$message({
                        message: res.data.message,
                        // type: type
                        type
                    })
                })
            }else{
                // 添加文章
                // 进行文章发表
                publisherArticle(query).then(res=>{
                    console.log(200,res);
                    let type = "error";
                    if(res.data.message == "文章发布成功"){
                        // 跳转文章列表
                        this.$router.push("/index/articleList")
                        type = "success"
                    }
                    this.$message({
                        message: res.data.message,
                        // type: type
                        type
                    })
                })
            }

        }
    }
}
</script>

<style lang="less" scoped>
.el-card{
    margin-top: 20px;
}
</style>