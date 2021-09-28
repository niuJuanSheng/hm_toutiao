import axios from "axios";

axios.defaults.baseURL = "http://127.0.0.1:3000"
// axios.defaults.baseURL = "http://157.122.54.189:6002"

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    let token = localStorage.getItem("hm-token-backend");
    if(token){
        config.headers.Authorization  = token;
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

export default axios