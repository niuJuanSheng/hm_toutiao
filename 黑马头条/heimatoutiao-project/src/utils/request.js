import axios from "axios"

// axios.defaults.baseURL = "http://157.122.54.189:6002"
axios.defaults.baseURL = "http://127.0.01:3000"

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // 添加token
    let token = localStorage.getItem("hm-token-67");
    if(token){
        config.headers.Authorization = token;
    }

    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // console.log(24,response);
    // 未登录，让页面跳转到登录页
    if(response.data.message == "用户信息验证失败"){
        // 获取跳转前的URL地址
        let url = location.href;
        // 保存跳转前的URL地址
        location.hash = "#/login?redirect_url="+url
        // location.href = "http://localhost:8080/#/login"
    }
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default axios