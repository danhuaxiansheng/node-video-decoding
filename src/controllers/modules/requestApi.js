const apiUtils = require("../../utils/apiUtils.js");
const request = require("../../utils/request.js");
const { setGetParams } = require("../../utils/url.js");

// 解析视频源
exports.getUrlSourse = async (url) => {
  let sourseModel = apiUtils.getSourseUrl(url);
  let apiUrl = setGetParams(sourseModel.url, sourseModel.params);
  return new Promise(function (resolve, reject) {
    request
      .get(apiUrl)
      .then((result) => {
        let data = JSON.parse(result).data ?? [];
        resolve({ code: 200, msg: "查询成功。", data: data });
      })
      .catch((d) => {
        reject({ code: 500, msg: "请求失败" });
      });
  });
};
