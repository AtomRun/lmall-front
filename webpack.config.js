// 导入path模块
const path = require('path')

var webpack =require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

// 环境变量配置，dev / online
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';
console.log(WEBPACK_ENV)

// 封装函数，return参数
// 获取html-webpack-plugin参数的方法
var getHomeConfig = function(name){
    return {
        template : './src/view/'+ name +'.html',
            filename :'view/'+ name +'.html',
            inject:true,
            hash:true,
            chunks:['common',name]
    };
}
// webpack config
var config = {
    entry: {
        'common':['./src/page/common/index.js'],
        'index':['./src/page/index/index.js'],
        'login':['./src/page/login/index.js'],
    },
    output: {
        // 动态获取路径
        // node上下文的全局变量，代表所在文件的路径，即绝对路径
        path:path.resolve(__dirname,'dist'),
        publicPath:'/dist',
        filename:'js/[name].js'
    },
    externals: {
        jquery :"window.jQuery"
    },
    module:{
        loaders:[
            {test:/\.css$/,loader:ExtractTextPlugin.extract("style-loader","css-loader")},
            {test:/\.string$/, loader: 'html-loader'},
        ]
    },
    plugins:[
        // 独立通用模块到js/base.js
        new webpack.optimize.CommonsChunkPlugin({
            name :'common',
            filename :'js/base.js'
        }),
        //将css单独打包到css下
        new ExtractTextPlugin("css/[name].css"),
        // html模板处理
        new HtmlWebpackPlugin(getHomeConfig('index')),
        new HtmlWebpackPlugin(getHomeConfig('login'))
    ]
};
if('dev' === WEBPACK_ENV){
    config.entry.common.push('webpack-dev-server/client?http://localhost:8088/');
}
module.exports = config;