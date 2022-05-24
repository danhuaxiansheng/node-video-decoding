const { getMovieList } = require("../api/aiqiyi.js");

// 获取电影列表
exports.getDataList = async (res = {}) => {
  return getMovieList(res.keywords);
};
