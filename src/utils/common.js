const crawler = require("crawler");
const cheerio = require("cheerio");
const { setGetParams } = require("./url.js");
const request = require("./request.js");

// 获取视频
exports.getVideo = async (searchKey, url) => {
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
        headers: { "User-Agent": "requests" },
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

exports.getVideoList = async (res = {}) => {
  return new Promise(function (resolve, reject) {
    let params = {
      pageNum: 1,
      key: res.key,
      channel_name: "电影",
      duration_level: 0,
      need_qc: 0,
      site_publish_date_level: null,
      site: "iqiyi",
      mode: 1,
      bitrate: null,
      af: 1,
    };

    let url = setGetParams(
      "https://pcw-api.iqiyi.com/strategy/pcw/data/soBaseCardLeftSide",
      params
    );
    request
      .get(url)
      .then((result) => {
        let formatData = JSON.parse(result).data?.formatData ?? {};
        let list = formatData?.list ?? [];
        let data = list.filter((d) => d.tag === params.channel_name);
        resolve({ code: 200, msg: "查询成功。", data: data });
      })
      .catch((d) => {
        reject({ code: 500, msg: "请求失败" });
      });
  });
};
