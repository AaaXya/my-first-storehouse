//服务器模块
const http = require('http');

const server = http.createServer();

let router = require('./router');

router.start(server);

server.listen(7070, () => {
    console.log('启动7070');
})
