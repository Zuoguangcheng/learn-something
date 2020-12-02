const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

const merge = require('webpack-merge');

const argv = require('yargs-parser')(process.argv.slice(2));
const _mode = argv.mode || 'development';
const _mergeConfig = require(`./config/webpack.${_mode}`);



const loading = {
    html: '加载中...',
};



const webpackConfig = {
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
        }, ],
    },
    optimization: {
        splitChunks: {
            // 公用包
            cacheGroups: {
                commons: {
                    chunks: 'initial', // initial 入口chunk，对于异步导入的文件不处理, async 异步chunk，只对异步导入的文件处理, all 全部chunk
                    name: 'common', // 打出来的包名
                    minChunks: 1, // 包被最少的引用次数
                    maxInitialRequests: 5, // 最大请求数不能超过5个，最大初始化加载次数，一个入口文件可以并行加载的最大文件数量，默认1，不包括runtime文件
                    minSize: 0, // js文件最小尺寸
                }
            }
        },
        runtimeChunk: {
            // 不能放在cdn中请求，要放在html中，减少请求
            name: 'runtime',
        }
    },
    plugins: [
        new HtmlWebpackPlugin({ // Also generate a test.html
            filename: 'index.html',
            template: 'src/index.html',
            loading,
        }),

        // 打包结束通知
        new WebpackBuildNotifierPlugin({
            title: 'Webpack Build Over',
            suppressSuccess: true
        }),

        // 热更新
        new webpack.HotModuleReplacementPlugin(),
    ],
}



module.exports = merge(webpackConfig, _mergeConfig);