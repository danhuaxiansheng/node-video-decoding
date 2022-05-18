const { Common } = require("../../controllers/index.js");
module.exports = function (app) {
  app.post("/api/common/searchBooksList", Common.searchBooksList);
  app.post("/api/common/getCatalog", Common.getCatalog);
  app.post("/api/common/getBooksText", Common.getBooksText);
  app.post("/api/common/getVideo", Common.getVideo);
};
