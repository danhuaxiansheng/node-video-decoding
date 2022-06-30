// const bookSourceUrl = "https://www.xbiquge.la/modules/article/waps.php";

const {
  getBooksText,
  booksIndexList,
  getFreeContent,
  getBookInfo,
  getDataList,
} = require("./modules/crawlerApi.js");

// const { getBookInfo } = require("./modules/requestApi.js");

const error = { code: 500, msg: "接口查询失败。" };
const success = { code: 200, msg: "查询成功。" };

// 获取首页内容
exports.getBookIndex = async (req, res) => {
  booksIndexList()
    .then((d) => res.send({ ...success, data: d.data }))
    .catch(() => res.send(error));
};

// 获取小说查询结果
exports.getDataList = async (req, res) => {
  getDataList(req.query.keywords ?? "")
    .then((d) => res.send({ ...success, data: d.data }))
    .catch(() => res.send(error));
};

// 获取小说说明/目录
exports.getBookInfo = async (req, res) => {
  getBookInfo(decodeURIComponent(req.query.url ?? ""))
    .then((d) => res.send({ ...success, data: d.data }))
    .catch(() => res.send(error));
};

// 获取免费内容正文
exports.getFreeContent = async (req, res) => {
  getFreeContent(decodeURIComponent(req.query.contentUrl ?? ""))
    .then((d) => res.send({ ...success, data: d.data }))
    .catch(() => res.send(error));
};

// 获取文章内容
exports.getBooksText = async (req, res) => {
  getBooksText(decodeURIComponent(req.query.url ?? ""))
    .then((d) => res.send({ ...success, data: d.data }))
    .catch(() => res.send(error));
};
