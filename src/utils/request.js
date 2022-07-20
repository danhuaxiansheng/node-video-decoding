const URL = require("url");
const zlib = require("zlib");
const http = require("http");
const https = require("https");
const qs = require("querystring");

class Request {
  constructor() {}

  getHeaders(host, postData) {
    let headers = {
      // Host: host,
      Pragma: "no-cache",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept-Language": "zh-CN,zh;q=0.9",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
    };
    if (postData != "") {
      headers["Content-Length"] = Buffer.byteLength(postData);
    }
    return headers;
  }

  request(method, url, params) {
    let postData = qs.stringify(params || {});
    let urlObj = URL.parse(url);
    let protocol = urlObj.protocol;
    let options = {
      hostname: urlObj.host,
      // port: urlObj.port,
      path: urlObj.path,
      method: method,
      headers: this.getHeaders(urlObj.host, postData),
    };
    return new Promise((resolve, reject) => {
      let req = (protocol == "http:" ? http : https).request(options, (res) => {
        let chunks = [];
        res.on("data", (data) => {
          chunks.push(data);
        });
        res.on("end", () => {
          let buffer = Buffer.concat(chunks);
          let encoding = res.headers["content-encoding"];
          if (encoding == "gzip") {
            zlib.gunzip(buffer, function (err, decoded) {
              resolve(decoded.toString());
            });
          } else if (encoding == "deflate") {
            zlib.inflate(buffer, function (err, decoded) {
              resolve(decoded.toString());
            });
          } else {
            resolve(buffer.toString());
          }
        });
      });
      req.on("error", (e) => {
        reject(e);
      });
      if (postData != "") {
        req.write(postData);
      }
      req.end();
    });
  }

  get(url) {
    return this.request("GET", url, null);
  }

  post(url, params) {
    return this.request("POST", url, params);
  }
}

module.exports = new Request();
