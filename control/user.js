const md5 = require("md5")

// 导入模型对象
const userModel = require("../models/user")
// 获取用户列表
exports.list = async (req, res) => {
  try {
    const data = await userModel.find()
    if (!data) return res.status(404).json({ msg: "查询失败!" })
    res.status(200).json({
      msg: "查询成功!",
      data: data,
    })
  } catch (error) {
    res.json({
      msg: "查询失败!",
      err: error,
    })
  }
}

// 创建用户
exports.create = async (req, res) => {
  try {
    let { name, password, department, roles } = req.body
    password = md5(password)
    const data = await userModel.create({
      name: name,
      password: password,
      rolesId: roles,
      departmentId: department,
    })
    console.log("data", data)
    if (!data) return res.status(500).json({ msg: "创建失败!" })
    res.status(201).json({
      msg: "创建成功!",
      data: data,
      status: 200,
    })
  } catch (error) {
    res.json({
      msg: "创建失败!",
      err: error,
    })
  }
}

// 更新指定id用户
exports.update = async (req, res) => {
  try {
    let _id = req.params.id
    let { roles, department, name } = req.body

    // 构建更新对象
    const updateData = { name }

    // 如果roles存在，更新到rolesId字段
    if (roles) {
      updateData.rolesId = roles
    }

    // 如果department存在，更新到departmentId字段
    if (department) {
      updateData.departmentId = department
    }

    const data = await userModel.findByIdAndUpdate(_id, updateData, {
      new: true,
    })

    console.log("更新结果", data)
    if (!data) return res.status(400).json({ msg: "更新失败!" })

    res.status(201).json({
      msg: "更新成功!",
      data: data,
    })
  } catch (error) {
    res.json({
      msg: "更新失败!",
      err: error,
    })
  }
}

// 删除指定id用户
exports.delete = async (req, res) => {
  try {
    let _id = req.params.id
    if (req.body.userId === _id) {
      res.json({ msg: "无法删除自身!", status: -1 })
      return
    }
    const user = await userModel.findById(_id)
    if (
      user.rolesId[0].toString() === "64a52cb6d225ead824895477" &&
      req.body.userId !== "64a52cb6d225ead824895477"
    ) {
      return res.json({ msg: "权限不足无法删除！", status: -2 })
    }
    const data = await userModel.findByIdAndDelete(_id)
    console.log()
    if (!data) return res.json({ msg: "删除失败!", status: -3 })
    res.json({ msg: "删除成功!" })
  } catch (error) {
    res.json({
      msg: "删除失败!",
      err: error,
    })
  }
}

// 根据id查询单个用户
exports.one = async (req, res) => {
  try {
    let _id = req.params.id
    const data = await userModel.findById(_id)
    if (!data) return res.status(404).json({ msg: "查询失败!" })
    res.status(200).json({
      msg: "查询成功!",
      data: data,
    })
  } catch (error) {
    res.json({
      msg: "查询失败!",
      err: error,
    })
  }
}

// 给指定id用户分配角色
exports.updateRoles = async (req, res) => {
  try {
    let _id = req.params.id
    let roles = req.body
    const data = await userModel.findByIdAndUpdate(_id, roles)
    if (!data) return res.status(400).json({ msg: "角色分配失败!" })
    res.status(201).json({
      msg: "角色分配成功!",
      data: data,
    })
  } catch (error) {
    res.json({
      msg: "角色分配失败!",
      err: error,
    })
  }
}
