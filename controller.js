//业务处理模块
let fs = require('fs');

//引入template模板引擎
const template = require('art-template');

template.defaults.root = './';


module.exports = {
    other: function (req, res) {
        fs.readFile('.' + req.url, (err, data) => {
            if (!err) {
                res.end(data)
            } else {
                res.end('')
            }
        })
    },
    index: function (res) {
        fs.readFile('./index.html', (err, html_data) => {
            res.end(html_data)
        })
    },
    //查看界面
    getone: function (req, res, id) {
        fs.readFile('./gdt.json', 'utf8', (err, data) => {
            let arr = JSON.parse(data);
            let userinfo = '';
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].id == id) {
                    userinfo = arr[i];
                }
            }
            // console.log(userinfo);
            let htmls = template('./user.html', { data: userinfo })
            res.end(htmls);
        })
    },
    getedit: function (req, res, id) {
        fs.readFile('./gdt.json', 'utf8', (err, data) => {
            let arr = JSON.parse(data);
            let edituser = '';
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].id == id) {
                    edituser = arr[i];
                }
            }
            let htmls = template('./edit.html', { data: edituser })
            res.end(htmls)
        })
    },
    editpost: function (req, res, id) {
        const formidable = require('formidable');
        const form = formidable({ multiples: true, uploadDir: 'G:\\university\\wzdj\\javascript\\node\\1\\n-a\\jq-ajax' });

        form.parse(req, function (err, fields, files) {
            // fields  表单数据
            fs.rename(files.img.path, './img/' + files.img.name, err => {
                if (err) {
                    console.log("移动失败!");
                } else {
                    console.log("移动成功!");
                }
                // 删除移动失败文件
                fs.unlink(files.img.path, function (err) {
                    if (err) throw err;
                });
                fs.readFile('./gdt.json', 'utf8', (err, json_data) => {
                    //解析
                    let json_arr = JSON.parse(json_data);
                    for (let i = 0; i < json_arr.length; i++) {
                        if (json_arr[i].id == id) {
                            json_arr[i].id = fields.bianhao;
                            json_arr[i].names = fields.names;
                            json_arr[i].sex = fields.sex;
                            json_arr[i].arcana = fields.arcana;
                            //未上传处理
                            if (files.img.size == 0 && files.img.name == '') {
                                break
                            }
                            json_arr[i].img = '/img' + '/' + files.img.name;
                        }
                    }
                    fs.writeFile('./gdt.json', JSON.stringify(json_arr), err => {
                        res.setHeader('Content-type', 'text/html;charset=utf-8')
                        if (!err) {
                            res.end('<script>alert("修改成功");location.href="/"</script>')
                        } else {
                            res.end('<script>alert("修改失败")</script>')
                        }
                    })
                })
            });
        })
    },
    getAll: function (req, res) {
        fs.readFile('./gdt.json', 'utf8', (err, json_data) => {
            res.setHeader('Content-Type', 'text/plain;charset=utf-8')
            res.end(json_data)
        })
    },
    getAddHtml: function (req, res) {
        fs.readFile('./add.html', 'utf8', (err, html_add) => {
            res.end(html_add)
        })
    },

    //formidable处理
    ajaxAddData: function (req, res) {
        //利用formidable接收post请求数据
        const formidable = require('formidable');
        //uploadDir 跨盘符设置
        const form = formidable({ multiples: true, uploadDir: 'G:\\university\\wzdj\\javascript\\node\\1\\n-a\\jq-ajax' })

        form.parse(req, function (err, fields, files) {
            if (!err) {
                //rename(旧路径,新的路径)
                //'./img/' + files.img.name  当前文件目录下的下级img  img.name 图片名.格式
                fs.rename(files.img.path, './img/' + files.img.name, err => {
                    if (err) {
                        console.log("移动失败");
                    } else {
                        console.log("移动成功");
                    }
                    //获取数据进行json解析
                    fs.readFile('./gdt.json', 'utf8', (err, json_data) => {
                        let json_arr = JSON.parse(json_data);
                        //组装新数组
                        //获取到的表单内容修改
                        fields.id = Number(json_arr[json_arr.length - 1].id) + 1;
                        fields.img = '/img' + '/' + files.img.name;
                        json_arr.push(fields);
                        fs.writeFile('./gdt.json', JSON.stringify(json_arr), err => {
                            if (!err) {
                                res.end('1')
                            } else {
                                console.log(err);
                                res.end('0')
                            }
                        })
                    })
                })
            } else {
                console.log(err);
                console.log('出错');
            }
        });
    },
    //删除
    deluser: function (req, res, id) {
        if (id !== 'null') {
            fs.readFile('./gdt.json', 'utf8', (err, json_data) => {
                let json_arr = JSON.parse(json_data);
                let new_arr = [];
                for (let i = 0; i < json_arr.length; i++) {
                    if (json_arr[i].id != id) {
                        new_arr.push(json_arr[i]);
                    }
                }

                fs.writeFile('./gdt.json', JSON.stringify(new_arr), err => {
                    res.setHeader('Content-type', 'text/html;charset=utf-8')
                    if (!err) {
                        res.end('success')
                    } else {
                        res.end('failed')
                    }
                })
            })
        } else {
            res.end('0')
        }
    }
}