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

// 获取书籍目录
exports.getCatalog = async (url) => {
  var crawler_1 = new crawler({
    encoding: null,
    method: "get",
    priority: 5, //queue请求优先级，模拟用户行为
    timeout: 10000, //10s req无响应，req失败
    maxConnections: 1, //只有在rateLimit == 0时起作用，限制并发数
    jQuery: false,
  });

  let getChpter = ($) => {
    let chapter = [];
    $("#list dl dd a").each((i, e) => {
      //书的地址
      let href = $(e).attr("href").split("/")[3];
      let json = {
        index: i + 1,
        href: url + href,
        //标题
        title: $(e).text(),
      };
      chapter.push(json);
    });
    return chapter;
  };

  let getBookInfo = ($) => {
    let bookInfo = {};
    let imgStr = $("#fmimg img").attr("src").trim();
    let intro = $("#intro p:last").text().trim();
    let name = $("#maininfo #info h1").text().trim();
    let author = $("#maininfo #info p:first")
      .text()
      .trim()
      .replace(/ /g, "")
      .replace("作者：", "");

    bookInfo.author = author;
    bookInfo.bookTitle = name;
    bookInfo.intro = intro;
    bookInfo.imgUrl = imgStr;
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
          //目录数组
          let catalogList = getChpter($);
          let info = getBookInfo($);

          resolve({
            code: 200,
            msg: "读取完毕",
            data: {
              info,
              catalogList,
            },
          });
        },
      });
    }
  });
};

// 获取网页所有小说列表
exports.booksListHtml = async (searchKey, url) => {
  var crawler_1 = new crawler({
    encoding: null,
    method: "post",
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
        url: url,
        method: "post",
        headers: { Referer: url, "User-Agent": "requests" },
        formData: {
          searchkey: searchKey || "",
        },
        callback: function (err, res, done) {
          if (err) {
            reject({ code: 500, msg: "获取失败" });
            return;
          }
          let data = [];
          let $ = cheerio.load(res.body.toString());
          let resultList = $("#checkform table tr");
          if (resultList.length !== 0) {
            resultList.each((inx, $item) => {
              let $tdList = $($item).find("td");
              if ($tdList.length > 0 && $tdList.find("a").length !== 0) {
                let catalog = {
                  bookTitle: $($tdList[0]).text().trim(),
                  bookUrl: $($tdList[0]).find("a").attr("href").trim(),
                  newestTitle: $($tdList[1]).text().trim(),
                  newestUrl: $($tdList[1])
                    .find("a")
                    .attr("href")
                    .trim()
                    .split("/")[3],
                  author: $($tdList[2]).text().trim(),
                  lastTime: $($tdList[3]).text().trim(),
                };
                data.push(catalog);
              }
            });
          }
          resolve({
            code: 200,
            data,
          });
        },
      });
    }
  });
};

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
          debugger;
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
function getTopListAttr($list,$) {
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
      title: $dom.find("h3.wrap-title").text(),
      href: $dom.find("h3.wrap-title a:first").attr("href"),
      list: getTopListAttr(dList,$),
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
      list: getHotListAttr(dList,$),
    };
    list.push(ob);
  });
  return list;
}

// 获取热门数据 某一列数据
function getHotListAttr($list,$) {
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
  let rankList = $(".hot-classify-wrap ul li");
  let list = [];
  rankList.each((inx, $item) => {
    let $dom = $($item);
    let dList = $dom.find(".center-book-list ul li");
    if (!dList || dList.length == 0) {
      return;
    }
    let ob = {
      title: $dom.find("h3.wrap-title").text(),
      list: getNewListAttr(dList,$),
    };
    list.push(ob);
  });
  return list;
}

// 获取新小说数据 某一列数据
function getNewListAttr($list,$) {
  let list = [];
  $list.each((inx, $item) => {
    let $dom = $($item);
    let $info = $dom.find(".book-info");
    let ob = {
      imgUrl: $dom.find(".book-img img").attr("src"),
      title: $info.find("h3 a:first").text(),
      href: "https:" + $info.find("h3 a:first").attr("href"),
      desc: $info.find("p").text(),
      author: $info.find(".author").text(),
    };
    list.push(ob);
  });
  return list;
}
