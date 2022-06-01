const {
  getVideo,
  getVideoAnalysis,
  getDataList,
  getVideoHtmlbyAQY,
} = require("../../utils/common");

exports.getVideo = async (req, res) => {
  getVideo(decodeURI(req.body.url || ""))
    .then((d) => res.send({ code: 200, msg: "查询成功。", data: d.data }))
    .catch(() => res.send({ code: 500, msg: "接口查询失败。" }));
};

exports.getVideoAnalysis = async (req, res) => {
  getVideoAnalysis(decodeURI(req.body.url || ""))
    .then((d) => res.send({ code: 200, msg: "查询成功。", data: d.data }))
    .catch(() => res.send({ code: 500, msg: "接口查询失败。" }));
};

exports.getDataList = async (req, res) => {
  getDataList({ keywords: req.body.keywords || "" })
    .then((d) => res.send({ code: 200, msg: "查询成功。", data: d.data }))
    .catch(() => res.send({ code: 500, msg: "接口查询失败。" }));
};
exports.getVideoHtmlbyAQY = async (req, res) => {
  getVideoHtmlbyAQY(decodeURI(req.body.url || ""))
    .then((d) => res.send({ code: 200, msg: "查询成功。", data: d.data }))
    .catch(() => res.send({ code: 500, msg: "接口查询失败。" }));
};
