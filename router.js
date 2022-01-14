let url = require('url');
let controller = require('./controller');

// 路由模块 解析不同的请求
module.exports = {
    start: function (server) {

        //监听请求事件
        server.on('request', (req, res) => {
            //解析url +true 会把id=3转化为对象 属性id 值为3{id:3}
            let urls = url.parse(req.url, true);
            //判断请求地址
            if (req.method == 'GET') {
                if (urls.pathname == '/') {
                    controller.index(res);
                } else if (urls.pathname == '/getall') {
                    controller.getAll(req, res);
                } else if (urls.pathname == '/add') {
                    controller.getAddHtml(req, res);
                } else if (urls.pathname == '/getone') {
                    controller.getone(req, res, urls.query.id);
                } else if (urls.pathname == '/edituser') {
                    controller.getedit(req, res, urls.query.id);
                } else {
                    controller.other(req, res);
                }
            } else if (req.method == 'POST') {
                if (urls.pathname == '/submit') {
                    controller.ajaxAddData(req, res)
                } else if (urls.pathname == '/editpost') {
                    controller.editpost(req, res, urls.query.id);
                }
            } else if (req.method == 'DELETE') {
                //删除
                if (urls.pathname == '/deluser') {
                    controller.deluser(req, res, urls.query.id);
                }
            } else {

            }
        })
    }
}