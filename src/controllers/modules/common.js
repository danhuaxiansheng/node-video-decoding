const fs = require("fs");

const bookSourceUrl = "https://www.xbiquge.la/modules/article/waps.php";

const {
  getBooksText,
  getCatalog,
  booksListHtml,
  getVideo,
} = require("../../utils/common");

// 查询所有书籍信息
exports.searchBooksList = async (req, res) => {
  booksListHtml(req.body.keywords, bookSourceUrl).then((result) => {
    res.send({ code: 200, msg: "查询成功。", data: result.data });
  });
};

exports.getCatalog = async (req, res) => {
  let bookUrl = unescape(req.body.bookUrl || "");
  getCatalog(bookUrl).then((result) => {
    res.send({ code: 200, msg: "查询成功。", data: result.data });
  });
};

exports.getBooksText = async (req, res) => {
  let bookUrl = unescape(req.body.bookUrl || "");
  getBooksText(bookUrl).then((result) => {
    res.send({ code: 200, msg: "查询成功。", data: result.data });
  });
};

exports.getVideo = async (req, res) => {
  getVideo(unescape(req.body.baseUrl || "")).then((result) => {
    res.send({ code: 200, msg: "查询成功。", data: result.data });
  });
};
