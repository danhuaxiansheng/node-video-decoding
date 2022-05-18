// 引入multer中间件，用于处理上传的文件数据
const multer = require("multer");
// 引入body-parser中间件，用来处理post请求体body中的数据
const bodyParser = require("body-parser");

const path = require("path");
const express = require("express");
const app = express();
const http = require("http");

const { port } = require("./src/setting");


app.set('port', port || 3000);


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

// 读取静态资源
app.use(express.static(path.join(__dirname, "public")));
// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: "50mb" }));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// 通过配置multer的dest属性， 将文件储存在项目下的tmp文件中
app.use(multer({ dest: "./public/temp/" }).any());

require("./src/routes/index.js")(app);
// set port, listen for requests
// app.listen(port, function () {
//   console.log("Server is running http://localhost:" + port);
// });

http.createServer(app).listen(app.get('port'), function(){
  console.log("服务器已经启动: http://localhost:" + app.get('port'));
 });
