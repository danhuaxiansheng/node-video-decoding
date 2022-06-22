const cheerio = require("cheerio");
// 异步请求
const crawler = require("crawler");
// var defaultOptions = {
//   autoWindowClose: true,
//   forceUTF8: true,
//   gzip: true,
//   incomingEncoding: null,
//   jQuery: true, //res 是否注入 cheerio，doc有详细说明
//   maxConnections: 10, //只有在rateLimit == 0时起作用，限制并发数
//   method: "GET",
//   priority: 5, //queue请求优先级，模拟用户行为
//   priorityRange: 10,
//   rateLimit: 0, //请求最小间隔
//   referer: false,
//   retries: 3, //重试次数，请求不成功会重试3次
//   retryTimeout: 10000, //重试间隔
//   timeout: 15000, //15s req无响应，req失败
//   skipDuplicates: false, //url去重，建议框架外单读使用seenreq
//   rotateUA: false, //数组多组UA
//   homogeneous: false,
// };

// 获取正文
exports.getBooksText = async (url) => {
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
      crawler_1.queue({
        //书目录地址
        url: url,
        //模仿客户端访问
        headers: { Referer: url, "User-Agent": "requests" },
        callback: function (err, res, done) {
          if (err) {
            reject({ code: 500, msg: "获取失败" });
            return;
          }
          let $ = cheerio.load(res.body.toString());
          //把标题加入到每一张的前面
          let content = $("#content").text();
          resolve({ code: 200, msg: "获取成功", data: content });
        },
      });
    }
  });
};

// 获取小说说明详情，目录
exports.getBookInfo = async (url) => {
  var crawler_1 = new crawler({
    encoding: null,
    method: "get",
    priority: 5, //queue请求优先级，模拟用户行为
    timeout: 10000, //10s req无响应，req失败
    maxConnections: 1, //只有在rateLimit == 0时起作用，限制并发数
    jQuery: false,
  });

  let getChpter = ($) => {
    const $list = $(".catalog-content-wrap .volume-wrap ul li");

    let chapter = [];
    $list.each((i, e) => {
      let $a = $(e).find("a");
      //书的地址
      let json = {
        index: $a.text().split(" ")[0],
        href: $a.attr("href"),
        //标题
        title: $a.text().split(" ")[1],
      };
      chapter.push(json);
    });
    return chapter;
  };

  let getInfo = ($) => {
    const $panle = $(".book-detail-wrap");
    let bookInfo = {
      title: $panle
        .find(".book-detail-wrap .book-img img")
        .attr("alt")
        .replace("在线阅读", ""),
      imgUrl: $panle.find(".book-detail-wrap .book-img img").attr("src"),
      author: $panle.find(".book-info .writer").text(),
      intro: $panle.find(".book-info .intro").text(),
    };
    return bookInfo;
  };

  let getInfoDetail = ($) => {
    const $panle = $(".book-content-wrap .book-info-detail");
    const $newList = $panle.find(".book-state .update .charpter-container");
    let list = [];
    $newList.each((inx, $item) => {
      const $dom = $($item);
      const $a = $dom.find("a");

      list.push({
        index: $a.text().split(/[ :：]/)[0],
        href: $a.attr("href"),
        //标题
        title: $a.text().split(/[ :：]/)[1],
        time: $dom.find(".time").text(),
      });
    });

    let bookInfo = {
      list: list,
      intro: $panle.find(".book-intro").text(),
    };
    return bookInfo;
  };

  return new Promise(function (resolve, reject) {
    if (!url) {
      reject({ code: 500, msg: "参数错误!" });
    } else {
      crawler_1.queue({
        //书目录地址
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
          resolve({
            code: 200,
            msg: "读取完毕",
            data: {
              info: getInfo($),
              catalogList: getChpter($),
              infoDetail: getInfoDetail($),
            },
          });
        },
      });
    }
  });
};

/**  获取起点 首页热门 */

// 获取起点 首页
exports.booksIndexList = async () => {
  var crawler_1 = new crawler({
    encoding: null,
    method: "get",
    priority: 5, //queue请求优先级，模拟用户行为
    timeout: 10000, //10s req无响应，req失败
    maxConnections: 1, //只有在rateLimit == 0时起作用，限制并发数
    jQuery: false,
  });

  let url = "https://www.qidian.com/";

  return new Promise(function (resolve, reject) {
    if (!url) {
      reject({ code: 500, msg: "参数错误!" });
    } else {
      crawler_1.queue({
        url: url,
        method: "get",
        headers: { Referer: url, "User-Agent": "requests" },
        callback: function (err, res, done) {
          if (err) {
            reject({ code: 500, msg: "获取失败" });
            return;
          }
          let $ = cheerio.load(res.body.toString());

          let data = {
            // 榜单
            top: getTopList($),
            // 热门
            hot: getHotList($),
            newBook: getNewList($),
          };
          resolve({
            code: 200,
            data,
          });
        },
      });
    }
  });
};

// 获取榜单数据 某一列数据
function getTopListAttr($list, $) {
  let list = [];
  $list.each((inx, $item) => {
    let $dom = $($item).find("a:first");
    let ob = {
      title: $dom.text(),
      href: "https:" + $dom.attr("href"),
    };
    list.push(ob);
  });
  return list;
}

// 获取榜单数据
function getTopList($) {
  let rankList = $("#numero3 .rank-list-row .rank-list");
  let list = [];
  rankList.each((inx, $item) => {
    let $dom = $($item);
    let dList = $dom.find(".book-list ul li");
    if (!dList || dList.length == 0) {
      return;
    }
    let ob = {
      title: $dom.find("h3.wrap-title a:first").text(),
      href: $dom.find("h3.wrap-title a:first").attr("href"),
      list: getTopListAttr(dList, $),
    };
    list.push(ob);
  });
  return list;
}

// 获取热门数据
function getHotList($) {
  let rankList = $(".hot-classify-wrap ul li");
  let list = [];
  rankList.each((inx, $item) => {
    let $dom = $($item);
    let dList = $dom.find(".hot-book-list dd");
    if (!dList || dList.length == 0) {
      return;
    }
    let ob = {
      title: $dom.find("h3.wrap-title").text(),
      list: getHotListAttr(dList, $),
    };
    list.push(ob);
  });
  return list;
}

// 获取热门数据 某一列数据
function getHotListAttr($list, $) {
  let list = [];
  $list.each((inx, $item) => {
    let $dom = $($item);
    let ob = {
      tag: $dom.find("a:first").text(),
      title: $dom.find("a:last").text(),
      href: "https:" + $dom.find("a:last").attr("href"),
    };
    list.push(ob);
  });
  return list;
}

// 获取新小说数据
function getNewList($) {
  let rankList = $(".new-rec-wrap .center-book-list ul li");
  let list = [
    {
      title: "新书推荐",
      list: getNewListAttr(rankList, $),
    },
  ];

  return list;
}

// 获取新小说数据 某一列数据
function getNewListAttr($list, $) {
  let list = [];
  $list.each((inx, $item) => {
    let $dom = $($item);
    let $info = $dom.find(".book-info");
    let ob = {
      imgUrl: "https:" + $dom.find(".book-img img").attr("data-original"),
      title: $info.find("h3 a:first").text(),
      href: "https:" + $info.find("h3 a:first").attr("href"),
      desc: $info.find("p").text(),
      author: $info.find(".author").text(),
    };
    list.push(ob);
  });
  return list;
}

/**  获取起点 首页热门 */
