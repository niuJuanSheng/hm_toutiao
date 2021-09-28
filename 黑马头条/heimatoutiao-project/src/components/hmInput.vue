<template>
        <input class="hminput" 
        v-bind:value="value"
        :[attr]="{ success: isOk,err: !isOk }" 
        type="text" @blur="blurFn" @input="inputFn">
</template>

<script>
/***
 * 
 * 动态设置属性
 * v-bind:[attr] = ""
 * attr: vue变量，值可以是任意属性
 * 
 * */ 
export default {
    props: {
        value: String,
        reg: {
            type: RegExp
        }
    },
    data(){
        return {
            isOk: true,
            attr: ""
        }
    },
    created(){
        // 设置isOk的初始值
        if(this.reg.test(this.value)){
            // 输入正确，边框颜色变绿
            this.isOk = true;
        }else{
            // 输入不正确，边框颜色变红
            this.isOk = false;
        }
    },
    methods: {
        // 输入框失去焦点，判断用户输入内容是否正确
        blurFn(){
            this.attr = "class";
            // let reg = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
            console.log(this.reg, this.value);
            if(this.reg.test(this.value)){
                // 输入正确，边框颜色变绿
                this.isOk = true;
            }else{
                // alert("内容输入不正确！")
                this.$toast.fail('内容输入不正确！');
                // 输入不正确，边框颜色变红
                this.isOk = false;
            }
        },
        inputFn(event){
            // 通过事件对象来获取到输入框的value值
            // console.log(6666,event.target.value);
            // 子传父
            this.$emit("input",event.target.value)
        }
    }
}
</script>

<style lang="less" scoped>
.hminput{
    border: none;
    border-bottom: 2px solid #ddd;
    width: 100%;
    padding: 10px 5px;
}
.success{
    color: green;
    border-color: green;
}
.err{
    color: red;
    border-color: red;
}
</style>