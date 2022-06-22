const bookSourceUrl = "https://www.xbiquge.la/modules/article/waps.php";

const {
  getBooksText,
  getCatalog,
  booksListHtml,
  booksIndexList,
  getBookInfo,
} = require("./modules/crawlerApi.js");

const error = { code: 500, msg: "接口查询失败。" };
const success = { code: 200, msg: "查询成功。" };

// 获取首页内容
exports.getBookIndex = async (req, res) => {
  booksIndexList()
    .then((d) => res.send({ ...success, data: d.data }))
    .catch(() => res.send(error));
};

// 获取小说说明/目录
exports.getBookInfo = async (req, res) => {
  getBookInfo(req.query.url ?? "")
    .then((d) => res.send({ ...success, data: d.data }))
    .catch(() => res.send(error));
};

// 查询所有书籍信息
exports.getBooksList = async (req, res) => {
  booksListHtml(req.query.keywords ?? "", bookSourceUrl)
    .then((d) => res.send({ ...success, data: d.data }))
    .catch(() => res.send(error));
};

// 书籍目录
exports.getCatalog = async (req, res) => {
  getCatalog(req.query.url ?? "")
    .then((d) => res.send({ ...success, data: d.data }))
    .catch(() => res.send(error));
};

// 获取文章内容
exports.getBooksText = async (req, res) => {
  getBooksText(req.query.url ?? "")
    .then((d) => res.send({ ...success, data: d.data }))
    .catch(() => res.send(error));
};
