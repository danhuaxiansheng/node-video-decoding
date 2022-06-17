const crawler = require("crawler");
class crawlerModel {
  constructor() {
    let options = {
      encoding: null,
      method: "get",
      priority: 5, //queue请求优先级，模拟用户行为
      timeout: 10000, //10s req无响应，req失败
      maxConnections: 1, //只有在rateLimit == 0时起作用，限制并发数
      jQuery: false,
    };
    new crawler(options);
  }
}

module.exports = crawlerModel;
