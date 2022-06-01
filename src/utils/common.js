const crawler = require("crawler");
const cheerio = require("cheerio");

const { getMovieList, getVideoByGDD } = require("../api/aiqiyi.js");
// 获取电影列表
exports.getDataList = async (res = {}) => {
  return getMovieList(res.keywords);
};

// 获取书籍目录
exports.getVideo = async (url) => {
  var crawler_1 = new crawler({
    encoding: null,
    method: "get",
    priority: 5, //queue请求优先级，模拟用户行为
    timeout: 10000, //10s req无响应，req失败
    maxConnections: 1, //只有在rateLimit == 0时起作用，限制并发数
    jQuery: false,
  });
  return new Promise(function (resolve, reject) {
    if (!url) {
      reject({ code: 500, msg: "参数错误!" });
    } else {
      // ok解析
      let reqUrl = "https://m3u8.okjx.cc:3389/m13.php?url=" + url;
      let referer = "https://m3u8.okjx.cc:3389/13jx.php?url=" + url;
      crawler_1.queue({
        //书目录地址
        url: reqUrl,
        //模仿客户端访问
        headers: {
          Referer: referer,
          "User-Agent": "requests",
        },
        callback: function (err, res, done) {
          if (err) {
            reject({ code: 500, msg: "获取失败" });
            return;
          }
          //获取文本并且解析
          let $ = cheerio.load(res.body.toString());
          let html = $.html();
          let htmlN = html.substring(html.indexOf('"id": "'), html.length);
          htmlN = htmlN.substring(7, htmlN.indexOf('",'));
          let catchUrl = `https://api.nxflv.com/Cache/M3u8/${htmlN}.m3u8`;
          //目录数组
          resolve({
            code: 200,
            msg: "读取完毕",
            data: catchUrl,
          });
        },
      });
    }
  });
};

// 获取书籍目录
exports.getVideoAnalysis = async (url) => {
  return getVideoByGDD(url);
};

exports.getVideoAllLink = async (url) => {
  var jsonData = {
    // "http://okjx.cc/?url=", // 有效 但资源不是最新
    //  "https://z1.m1907.cn/?jx=" // 有效 需要更新令牌
  };
};
