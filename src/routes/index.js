const Video = require("../controllers/video/index.js");

const Book = require("../controllers/book/index.js");

// 视频接口前缀
const videoDic = "/api/video/";

// 书籍接口前缀
const bookDic = "/api/book/";

module.exports = function (app) {
  Object.keys(Video).forEach((d) => {
    // 根据函数前缀 判断是get还是post
    app[d.includes("get") ? "get" : "post"](videoDic + d, Video[d]);
  });
  Object.keys(Book).forEach((d) => {
    // 根据函数前缀 判断是get还是post
    app[d.includes("get") ? "get" : "post"](bookDic + d, Book[d]);
  });
};
