//引入express框架	返回值其实是一个方法
//再创建服务器就不需要再引用http模块的createHttp方法了。
const express = require("express");
const http = require("http");

const { port } = require("./src/setting");
const app = express();

// 引用各类中间件
require("./src/rely.js")(app);

//错误处理中间件    err就是错误对象
app.use((err, req, res, next) => {
  res.status(500).send("服务器出错");
});

//设置跨域访问
app.all("*", function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Authorization, Accept, X-Requested-With"
  );
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");

  if (req.method.toLowerCase() == "options") res.send(200);
  //让options尝试请求快速结束
  else next();
});

// 路由设置
// 在地址后面用冒号标识的即代表路由参数，如id等在这里表示占位符。
// 浏览器输入路径localhoat:3000/index/10/张三/56，输出{“id”:“10”,“name”:“张三”,“age”:“56”}
// app.get("'/index/:id/:name/:age'",(req,res)=>{
//   //req.params获取请求参数
//   res.send(req.params);
// })

// 加载路由
require("./src/routes/index.js")(app);

// 设置服务启动端口
app.set("port", port || 3000);

http.createServer(app).listen(app.get("port"), function () {
  console.log("服务器已经启动: http://localhost:" + app.get("port"));
});
