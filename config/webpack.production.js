/**
 * @fileoverview webpack production config
 * @author liuduan
 * @Date 2020-05-25 16:57:17
 * @LastEditTime 2020-06-11 15:48:37
 */
const path = require('path')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
console.log('PrerenderSPAPlugin', path.join(__dirname, '../dist'));
module.exports = {
    plugins: [
        new PrerenderSPAPlugin({
            // Required - The path to the webpack-outputted app to prerender.
            // staticDir是输出的目录
            staticDir: path.join(__dirname, '../dist'),
            // Required - Routes to render. routes是需要预渲染的route
            routes: ['/a', '/b'],
            renderer: new Renderer({
                renderAfterTime: 50000
            }),
            // Optional - The location of index.html
            // indexPath: path.join(__dirname, '../dist', 'index.html'),
        }),
    ],
}