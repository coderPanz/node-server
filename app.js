// 数据库连接成功后启动服务器
const db = require('./db/link/db')
db(() => {
  const express = require("express"); // 导入 express 模块
  const cors = require("cors"); // 导入 cors 中间件
  const adminRouter = require("./router/index");
  const bodyParser = require("body-parser");
  const { expressjwt: jwt } = require("express-jwt");
  const { jwtSecretKey } = require("./utils/generateToken/config/config");

  const app = express(); // 创建应用实例

  // 注册全局中间件解析token: 在路由注册之前, 可以很容易地保护资源和 API 接口，有效防止未经授权的访问
  app.use(
    jwt({
      secret: jwtSecretKey, // 签名的密钥
      algorithms: ["HS256"]
    }).unless({
      path: ['/api/login'], // 路径不经过token解析
    })
  );

  // 注册全局中间件, 允许跨域请求
  app.use(cors());

  // 配置解析中间件必须在注册路由之前
  // 1. 用于解析 HTTP 请求中的表单数据
  app.use(express.urlencoded({ extended: false }));
  // 2. 用于解析 HTTP 请求中的 JSON 格式的数据
  app.use(bodyParser.json());

  // 注册路由
  app.use("/api", adminRouter);

  // 配置错误级别中间件: 必须注册在所有路由之后
  app.use((err, req, res, next) => {
    console.log("服务器发生了错误: " + err.message); // 服务端提示
    res.send("服务器发生了错误: " + err.message); // 客户端提示
  });

  // 监听端口
  app.listen(8000, () => {
    console.log("服务启动成功");
  });
})

