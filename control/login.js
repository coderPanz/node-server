const md5 = require("md5")
const generateToken = require("../utils/generateToken/generateToken")
const userModel = require("../models/user")
exports.login = async (req, res) => {
  try {
    // 取出用户信息并向数据库查询
    let { name, password } = req.body
    password = md5(password)
    const data = await userModel.findOne({ name })
    // 235a354568bd8684061bc51c29b58903
    if (!data) return res.status(404).json({ msg: "登录失败!" })

    // 若查询成功后剔除或加密重要信息后, 生成token并返回给客户端
    const user = { ...req.body, password: md5(password) }
    const tokenStr = generateToken(user)

    res.status(200).json({
      msg: "查询成功!",
      id: data.rolesId[0],
      name: name,
      token: tokenStr,
      createTime: data.createdAt,
      userId: data._id
    })
  } catch (error) {
    res.json({
      msg: "登录失败!",
      err: error,
    })
  }
}
