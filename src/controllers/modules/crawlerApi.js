
const crawler = require("../../utils/crawler.js");

// 获取爱奇艺普通视频
exports.getVideoHtmlbyAQY = async (url) => {
  return new Promise(function (resolve, reject) {
    if (!url) {
      reject({ code: 500, msg: "参数错误!" });
    } else {
      crawler.queue({
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
          debugger;
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
