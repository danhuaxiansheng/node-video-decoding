const cheerio = require("cheerio");
// 异步请求
const puppeteer = require("puppeteer"); //github传送门 官网传送门
const crawler = require("crawler");

// 获取爱奇艺普通视频
exports.getVideoHtmlbyAQY = async (url) => {
  let options = {
    encoding: null,
    method: "get",
    priority: 5, //queue请求优先级，模拟用户行为
    timeout: 10000, //10s req无响应，req失败
    maxConnections: 1, //只有在rateLimit == 0时起作用，限制并发数
    jQuery: false,
  };

  const crawler1 = new crawler(options);
  return new Promise(function (resolve, reject) {
    if (!url) {
      reject({ code: 500, msg: "参数错误!" });
    } else {
      crawler1.queue({
        url: url,
        //模仿客户端访问
        headers: { Referer: url, "User-Agent": "requests" },
        callback: function (err, res, done) {
          if (err) {
            reject({ code: 500, msg: "获取失败" });
            return;
          }
          //获取文本并且解析
          let $ = cheerio.load(res.body.toString());
          let html = $.html();
          //目录数组
          resolve({
            code: 200,
            msg: "读取完毕",
            data: url,
          });
        },
      });
    }
  });
};

// 获取爱奇艺首页 热门
exports.getMovieIndex = async () => {
  const url = "https://www.iqiyi.com";
  let options = {
    encoding: null,
    method: "get",
    priority: 5, //queue请求优先级，模拟用户行为
    timeout: 10000, //10s req无响应，req失败
    maxConnections: 1, //只有在rateLimit == 0时起作用，限制并发数
    jQuery: false,
  };
  const crawler1 = new crawler(options);
  return new Promise(function (resolve, reject) {
    crawler1.queue({
      url: url,
      //模仿客户端访问
      headers: { Referer: url, "User-Agent": "requests" },
      callback: function (err, res, done) {
        if (err) {
          reject({ code: 500, msg: "获取失败" });
          return;
        }
        //获取文本并且解析
        const $ = cheerio.load(res.body.toString());
        const scriptCode = $("script")[0].children[0].data.replace(
          "window.__NUXT__=",
          ""
        );
        const esData = eval(scriptCode);
        //目录数组
        resolve({
          code: 200,
          msg: "读取完毕",
          data: esData?.data[0].sourceData ?? {},
        });
      },
    });
  });
};
