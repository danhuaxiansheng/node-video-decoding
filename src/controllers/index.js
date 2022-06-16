const { getMovieList } = require("../api/aiqiyi.js");
const { getVideoHtmlbyAQY } = require("./modules/crawlerApi.js");
const { getUrlSourse } = require("./modules/requestApi.js");

const error = { code: 500, msg: "接口查询失败。" };
const success = { code: 200, msg: "查询成功。" };

// 获取爱奇艺的所有视频列表
exports.getDataList = async (req, res) => {
  getMovieList(req.query.keywords)
    .then((d) => res.send({ ...success, data: d.data }))
    .catch(() => res.send(error));
};

// 获取爱奇艺免费视频
exports.getVideoHtmlbyAQY = async (req, res) => {
  getVideoHtmlbyAQY(req.query.url)
    .then((d) => res.send({ ...success, data: d.data }))
    .catch(() => res.send(error));
};

// 通过url映射数据源
exports.getUrlSourse = async (req, res) => {
  getUrlSourse(req.query.url)
    .then((d) => res.send({ ...success, data: d.data }))
    .catch(() => res.send(error));
};
