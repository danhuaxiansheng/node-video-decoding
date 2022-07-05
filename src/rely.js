// 用于处理 enctype=“multipart/form-data”（设置表单的MIME编码）的表单数据。
const multer = require("multer");
// 引入body-parser中间件，用来处理post请求体body中的数据
const bodyParser = require("body-parser");
// 处理跨域
const cors = require("cors");
// 服务器相对路径
const path = require("path");
// 引入express框架
const express = require("express");

module.exports = function (app) {
  // 允许跨域
  app.use(cors());
  // 读取静态资源
  app.use(express.static(path.join(__dirname, "public")));
  // parse requests of content-type - application/json
  app.use(bodyParser.json({ limit: "50mb" }));
  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  // 通过配置multer的dest属性， 将文件储存在项目下的tmp文件中
  app.use(multer({ dest: "./public/temp/" }).any());
};
