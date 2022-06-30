const request = require("../../../utils/request.js");

exports.getBookInfo = async (url) => {
  let nUrl = url.includes("https:") ? url : "https:" + url;
  return new Promise(function (resolve, reject) {
    request
      .get(nUrl)
      .then((result) => {
        let data = JSON.parse(result).data ?? [];
        resolve({ code: 200, msg: "查询成功。", data: data });
      })
      .catch((d) => {
        reject({ code: 500, msg: "请求失败" });
      });
  });
};
