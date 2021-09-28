<template>
    <div>
        <!-- 标题 -->
        <van-nav-bar title="个人信息编辑" @click-left="$router.back()"  @click-right="$router.push('/index')" left-arrow>
        <template #right>
            <van-icon name="wap-home-o" size="18" />
        </template>
        </van-nav-bar>
        <!-- 头像 -->
        <div class="head_img">
            <img :src="userInfo.head_img||'http://img1.imgtn.bdimg.com/it/u=3757784226,1202878475&fm=26&gp=0.jpghttp://img1.imgtn.bdimg.com/it/u=3757784226,1202878475&fm=26&gp=0.jpg'" alt="">
            <van-uploader accept="image/*" :after-read="afterRead" />
        </div>
        <!-- 昵称 、密码、性别 -->
        <van-cell title="昵称" is-link :value="userInfo.nickname" @click="nicknameDailog" />
        <!-- 
            v-model: 值用于控制弹窗显示隐藏
            confirm：当用户点击按钮时触发
         -->
        <van-dialog v-model="nicknameShow" @confirm="confirmNickname" :beforeClose="nicknameBeforeClose" title="标题" show-cancel-button>
              <van-field
                v-model="nickname"
                name="昵称"
                label="昵称"
                placeholder="昵称"
            />
        </van-dialog>
        <van-cell title="密码" is-link value="******" />
        <van-cell title="性别" is-link :value="userInfo.gender==1?'男':'女'" @click="genderShow=true" />
         <!-- 
             v-model： 控制显示隐藏
             actions: 弹窗选项
             select: 当用户点击选项时触发的时间
           -->
        <van-action-sheet v-model="genderShow" :actions="actions" @select="onSelect" />
    </div>
</template>

<script>
import { personal, upload, user_update } from "@/api/user"
import axios from "@/utils/request"
export default {
    data(){
        return {
            id: localStorage.getItem("hm-user-id-67"),
            userInfo: {},
            nicknameShow: false,
            nickname: "",
            genderShow: false,
            actions: [ {name: "女"}, {name: "男"} ]
        }
    },
    created(){
        // 请求个人信息默认数据
        let id = localStorage.getItem("hm-user-id-67")
        personal(id).then(res=>{
            this.userInfo = res.data.data;
        })
    },
    methods:{
        // 修改性别
        // 点击选项时触发
        onSelect(action,index){
            console.log(action,index);
            user_update(this.id, {
                gender: index
            }).then(res=>{
                console.log(70,res);
                this.userInfo.gender = res.data.data.gender;
                this.genderShow = false;
            })
        },
        // 显示修改昵称的弹窗
        nicknameDailog(){
            this.nicknameShow = true;
            this.nickname = this.userInfo.nickname;
        },
        // 昵称确认修改
        confirmNickname(){
            // 校验，昵称必须1到10位
            if(this.nickname.length>1&&this.nickname.length<10){
                // 符合要求
                user_update(this.id,{
                    nickname: this.nickname
                }).then(res=>{
                    console.log(61,res);
                    this.userInfo.nickname = res.data.data.nickname;
                })
            }else{
                // 不符合要求
                this.$toast.fail("昵称输入不合法！")
            }
        },
        // 弹窗关闭前的回调
        nicknameBeforeClose(action, done){
            // action的值为cancel：取消按钮，confirm：表示确认按钮
            // 当前用户点击了取消按钮的时候，直接关闭弹窗
            if(action=="cancel"){done();return}
            // 当用户点击确认按钮的时候，进行判断
            if(this.nickname.length>1&&this.nickname.length<10){
                // 昵称 符合要求  关闭弹窗
                done()
            }else{
                // 昵称不符合要求，不关闭弹窗
                done(false)
            }
        },
        // 修改头像
        async afterRead(data){
            // console.log(39,data);
            let id = localStorage.getItem("hm-user-id-67")
            // 1、上传图片，得到图片的线上地址 URL
            // 注意：上传文件需要传formdata格式的对象给后台
            let formdata = new FormData();
            formdata.append("file",data.file);
            // async await 可以把异步方法变成同步
            // 也就是说upload函数后面的代码，必须等待upload函数执行完成之后再继续执行。
            let res = await upload(formdata);
            console.log(46,res);
            // 2、修改头像
            user_update(id,{
                head_img:  axios.defaults.baseURL + res.data.data.url
            }).then(res=>{
                console.log(55,res);
                // 设置头像最新值
                this.userInfo.head_img = res.data.data.head_img;
            })
        }
    }
}
</script>

<style lang="less" scoped>
// less 样式穿透 /deep/
/deep/.van-nav-bar{
    height: 60px;
    line-height: 60px;
    border-bottom: 2px solid #ccc;
    div{
        height: 100%;
    }
}
.head_img{
    text-align: center;
    margin: 15px 0;
    position: relative;
    img{
        width: 30%;
    }
    /deep/.van-uploader{
        opacity: 0;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 30%;
        .van-uploader__upload{
            width: 100%;
            input{
                width: 100%;
            }
        }
    }
}

</style>