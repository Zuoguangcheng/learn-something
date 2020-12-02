module.exports = {
    output: {
        filename: "scripts/[name].bundle.js",
        publicPath: "/",
    },
    
    devServer: { // 默认热更新
        port: 3000,
        historyApiFallback: true,
        before(app) {
            app.get("/api/test", (req, res) => {
                res.json({
                    code: 0,
                    msg: "hello world"
                });
            });
        },
    }
}