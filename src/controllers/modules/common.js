const { getVideo, getDataList } = require("../../utils/common");

exports.getVideo = async (req, res) => {
  let url =
    "https://m3u8.okjx.cc:3389/m13.php?url=https://www.iqiyi.com/v_1pdntwc66rs.html";

  getVideo(unescape(url || "")).then((result) => {
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
