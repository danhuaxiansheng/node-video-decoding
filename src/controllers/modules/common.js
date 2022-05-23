const { getVideo, getVideoList } = require("../../utils/common");

exports.getVideo = async (req, res) => {
  getVideo(unescape(req.body.baseUrl || "")).then((result) => {
    res.send({ code: 200, msg: "查询成功。", data: result.data });
  });
};

exports.getVideoList = async (req, res) => {
  let params = {
    key: req.body.key || "",
  };

  getVideoList(params).then((result) => {
    debugger;
    res.send({ code: 200, msg: "查询成功。", data: result.data });
  });
};
