 
module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target:'http://124.223.98.94:81/wp-json',//这里填入你要请求的接口的前缀
                // target:'http://124.223.98.94:82/wp-/json/wp/v2/media',//这里填入你要请求的接口的前缀
                // ws:true,//代理websocked
                changeOrigin:true,//虚拟的站点需要更管origin
                secure: true,                   //是否https接口
                pathRewrite:{
                    '^/api':''//重写路径
                }
            },
            '/token': {
                target:'http://124.223.98.94:81/wp-json/jwt-auth/v1',//这里填入你要请求的接口的前缀
                // ws:true,//代理websocked
                changeOrigin:true,//虚拟的站点需要更管origin
                secure: true,                   //是否https接口
                pathRewrite:{
                    '^/token':''//重写路径
                }
            },
            '/upload': {
                target:'http://124.223.98.94:81/wp-json/wp/v2/media',//这里填入你要请求的接口的前缀
                // ws:true,//代理websocked
                changeOrigin:true,//虚拟的站点需要更管origin
                secure: true,                   //是否https接口
                pathRewrite:{
                    '^/upload':''//重写路径
                }
            }
        }
    },
    lintOnSave:false 
}