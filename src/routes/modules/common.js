const { Common } = require("../../controllers/index.js");
module.exports = function (app) {
  app.get("/api/common/getVideo", Common.getVideo);
  app.post("/api/common/getDataList", Common.getDataList);
};
