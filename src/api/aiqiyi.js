const { setGetParams } = require("../utils/url.js");
const request = require("../utils/request.js");

// let movieModel = {
//   desc: "", //描述;
//   actor: [], // 主演
//   director: [], // 导演
//   alias: "", // 别名
//   imgSrc: "", // 图片路径
//   title: "", // 电影名称
//   palyTime: "", // 播放时长
//   region: "", // 地区
//   reason: "", // 热度排行
//   score: "", // 电影分数
//   tag: "", // 所属类别（电影）
//   siteName: "", // 网站名称
//   year: "", // 首映年度
//   releaseTime: "", // 上映时间
//   palySrc: "", // 播放路径
// };

const baseUrl =
  "https://pcw-api.iqiyi.com/strategy/pcw/data/soBaseCardLeftSide";

// 获取电影列表
exports.getMovieList = async (key) => {
  let params = {
    pageNum: 1,
    key: key,
    channel_name: "电影",
    duration_level: 0,
    need_qc: 0,
    site_publish_date_level: null,
    site: "iqiyi",
    mode: 1,
    bitrate: null,
    af: 1,
  };
  let url = setGetParams(baseUrl, params);

  return new Promise(function (resolve, reject) {
    request
      .get(url)
      .then((result) => {
        let formatData = JSON.parse(result).data?.formatData ?? {};
        let list = formatData?.list ?? [];
        let data = list.filter((d) => d.tag === params.channel_name);
        data = data.map((d) => {
          return {
            desc: d.desc, //描述;
            actor: d.actor, // 主演
            director: d.director, // 导演
            alias: d.alias, // 别名
            imgSrc: d.g_img, // 图片路径
            title: d.g_title, // 电影名称
            palyTime: d.g_meta, // 播放时长
            region: d.region, // 地区
            reason: d.reason, // 热度排行
            score: d.score, // 电影分数
            tag: d.tag, // 所属类别（电影）
            siteName: d.siteName, // 网站名称
            year: d.year, // 首映年度
            releaseTime: d.releaseTime, // 上映时间
            palySrc: d.g_main_link, // 播放路径
          };
        });
        resolve({ code: 200, msg: "查询成功。", data: data });
      })
      .catch((d) => {
        reject({ code: 500, msg: "请求失败" });
      });
  });
};
