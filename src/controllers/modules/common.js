const { getVideo, getDataList } = require("../../utils/common");

exports.getVideo = async (req, res) => {
  getVideo(unescape(req.body.url || "")).then((result) => {
    res.send({ code: 200, msg: "查询成功。", data: result.data });
  });
};

exports.getDataList = async (req, res) => {
  let params = {
    keywords: req.body.keywords || "",
  };

  getDataList(params)
    .then((result) => {
      res.send({ code: 200, msg: "查询成功。", data: result.data });
    })
    .catch((d) => {
      res.send({ code: 500, msg: "接口查询失败。" });
    });
};
