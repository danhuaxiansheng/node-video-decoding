const Common = require("../controllers/index.js");
// 接口前缀
const pathdDic = "/api/common/";

module.exports = function (app) {
  Object.keys(Common).forEach((d) => {
    // 根据函数前缀 判断是get还是post
    app[d.includes("get") ? "get" : "post"](pathdDic + d, Common[d]);
  });
};
