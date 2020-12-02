/**
 * @fileoverview 
 * @author liuduan
 * @Date 2020-05-08 15:06:18
 * @LastEditTime 2020-06-06 11:04:54
 */
module.exports = {
    // TODO: 如果是type=module 就不编译
    // <script src="//polyfill.io/v3/polyfill.min.js"></script>
    // <script type="moudle" src="/main.js"></script>
    // <script nomodule src="/main.es5.js"></script> 
    "presets": [
        [
            "@babel/preset-env",
            {
                "modules": false,
                "useBuiltIns": "usage",// usage 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需添加。
                "corejs": 3,
                "targets": {
                    browsers: [
                        'Chrome >= 60',
                        'Safari > 10.1',
                        'iOS >= 10.3',
                        'Firefox >= 54',
                        'Edge >= 15',
                    ],
                },
            },
        ],
        "react-app",
    ],
    "plugins": [
        [
            "@babel/plugin-transform-runtime",
        ],
    ]
}
