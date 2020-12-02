/*
 * @Author: liuduan
 * @Date: 2020-03-15 16:31:54
 * @LastEditors: liuduan
 * @LastEditTime: 2020-03-15 17:06:39
 * @Description: test 异步请求307跳转，结论307不能异步跳转，需要在前端fetch res上通过redirected属性识别
 */

const http = require('http');


http.createServer((req, res) => {
    if (req.url === '/a') {
        res.write("woshi a")
    } else if (req.url === '/') {
        res.write(`
            <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    test
    <script>
        setTimeout(() => {

            console.log('10000')
            fetch('/api/test')
                // .then(res => res.text())
                .then(res => {
                    console.log(res)
                })
        }, 2000);
    </script>
</body>

</html>
        `)
    } else {
        res.writeHead(307, { 'Location': 'http://localhost:8000/a' });
        res.write('<a href="' + 'http://localhost:8000/a' + '">haha</a>')
    }

    res.end();
}).listen(8000);