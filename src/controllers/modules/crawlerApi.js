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

function htmlUtils($) {
  const $panle = $(".content-wrap .ch-res>.tl-layout[data-block-v2]");
  let tv = [];
  let movie = [];
  let variety = [];
  let tag = "";
  $panle.toArray().forEach((element) => {
    let type = element.attribs["data-block-v2"];
    let $liArr = $(element).find(".qy-mod-list ul li");
    let list = [];

    if (type.includes("dianshiju")) {
      list = tv;
      tag = "电视剧";
    } else if (type.includes("dianying")) {
      list = movie;
      tag = "电影";
    } else if (type.includes("zongyi")) {
      list = variety;
      tag = "综艺";
    }
    $liArr.toArray().forEach((d) => {
      let $dom = $(d);
      let href = $dom.find(".qy-mod-link-wrap a").attr("href");
      list.push({
        url: href.includes("https:") ? href : "https:" + href,
        imgSrc: $dom.find(".qy-mod-link-wrap picture img").attr("src"),
        name: $dom.find(".title-wrap a").text(),
        desc: $dom.find(".title-wrap .sub").text(),
        tag: tag,
      });
    });
  });
  return { tv, movie, variety };
}

// var getTimeOutHtml = (url) => {
//   debugger;
//   return new Promise(async function (resolve, reject) {
//     const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
//     const page = await browser.newPage();
//     await page.goto(url);

//     setTimeout(async function () {
//       const bodyHandle = await page.$("body");
//       const html = await page.evaluate((body) => body.innerHTML, bodyHandle);
//       let $ = cheerio.load(html);
//       const data = htmlUtils($);
//       await bodyHandle.dispose();
//       await browser.close();

//       //目录数组
//       resolve({
//         code: 200,
//         msg: "读取完毕",
//         data: data,
//       });
//     }, 500);
//   });
// };

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
        const data = htmlUtils($);
        //目录数组
        resolve({
          code: 200,
          msg: "读取完毕",
          data: data,
        });
      },
    });
  });
};
