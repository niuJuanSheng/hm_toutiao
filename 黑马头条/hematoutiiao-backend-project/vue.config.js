// 需要优化的依赖包cdn路径
let cdn = {
    css: [
      // element-ui css
      'https://unpkg.com/element-ui/lib/theme-chalk/index.css',// 样式表
      // 富文本框插件样式
      'https://cdn.bootcdn.net/ajax/libs/quill/2.0.0-dev.4/quill.bubble.css'
    ],
    js: [
        'https://unpkg.com/vue/dist/vue.js', // vuejs
      // element-ui js
      'https://unpkg.com/element-ui/lib/index.js', // elementUI
      // 富文本框插件
      'https://cdn.bootcdn.net/ajax/libs/quill/2.0.0-dev.4/quill.js'
    ]
}

module.exports = {
    publicPath: "./",
    configureWebpack: {
        externals:{
            'vue': 'Vue',
            'element-ui': 'ELEMENT',
            'quill': 'Quill'
        }
    },
    // 将cdn的资源挂载到插件上
    chainWebpack (config) {
        config.plugin('html').tap(args => {
        args[0].cdn = cdn
        return args
        })
    }
}