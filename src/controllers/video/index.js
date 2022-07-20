const { getMovieList } = require("../../api/aiqiyi.js");
const {
  getVideoHtmlbyAQY,
  getMovieIndex,
  getUrlSourse,
} = require("./modules/crawlerApi.js");
// const { getUrlSourse } = require("./modules/requestApi.js");

const error = { code: 500, msg: "接口查询失败。" };
const success = { code: 200, msg: "查询成功。" };

// 获取爱奇艺首页热门
exports.getMovieIndex = async (req, res) => {
  getMovieIndex()
    .then((d) => res.send({ ...success, data: d.data }))
    .catch(() => res.send(error));
};

// 获取爱奇艺的所有视频列表
exports.getDataList = async (req, res) => {
  getMovieList(decodeURIComponent(req.query.keywords))
    .then((d) => res.send({ ...success, data: d.data }))
    .catch(() => res.send(error));
};

// 爱奇艺 免费视频 iframe
exports.getVideoHtmlbyAQY = async (req, res) => {
  getVideoHtmlbyAQY(decodeURIComponent(req.query.url))
    .then((d) => res.send({ ...success, data: d.data }))
    .catch(() => res.send(error));
};

// 通过url映射数据源
exports.getUrlSourse = async (req, res) => {
  getUrlSourse(decodeURIComponent(req.query.url) || "")
    .then((d) => res.send({ ...success, data: d.data }))
    .catch(() => res.send(error));
};
