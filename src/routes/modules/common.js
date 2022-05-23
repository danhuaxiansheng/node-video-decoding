const { Common } = require("../../controllers/index.js");
module.exports = function (app) {
  app.post("/api/common/getVideo", Common.getVideo);
  app.get("/api/common/getVideoList", Common.getVideoList);
};
