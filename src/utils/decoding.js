const Koa = require("koa");
const Router = require("koa-router");
const buffer = require("buffer");
const app = new Koa();
const router = new Router();
const fs = require("fs");
const video = async (ctx, next) => {
  try {
    // open 一个放在服务器的视频
    let data = fs.readFileSync("XXX.XXX.XXX/simple.mp4");
    ctx.response.body = data;
  } catch (e) {
    return Promise.reject({
      status: 500,
      message: "视频传输错误",
    });
  }
  next();
};

router.get("/video", video);

app.use(router.routes()).use(router.allowedMethods());
app.listen(3001)