// 导入模型对象
const menuModel = require("../models/menu");

// 获取菜单列表
exports.list = async (req, res) => {
  try {
    // 因为所有菜单都集中在一个表中, 所以我们只需要查找主菜单, 子菜单使用poplate来填充
    const ids = ["64a52f2e584f55b8dd09c9ce", "64a530ca52e855dee749a2f5", "64a53b9922efcc29618d2251", "64a53c1b22efcc29618d225a"];

    const data = await menuModel.find({ _id: { $in: ids } }).populate({
      path: 'children',
      populate: {
        path: 'children'
      }
    })
    if(!data) return res.status(404).json({ msg: '查询失败!' })
    res.status(200).json({
      msg: '查询成功',
      data: data
    })
  } catch (error) {
    res.json({
      msg: '查询失败!',
      err: error
    })
  }
}

// 创建菜单
exports.create = async (req, res) => {
  try {
    let menuDoc = req.body
    const data = await menuModel.create(menuDoc)
    if(!data) return res.status(500).json({ msg: '创建失败!' })
    res.status(201).json({
      msg: '创建成功',
      data: data
    })
  } catch (error) {
    res.json({
      msg: '创建失败!',
      err: error
    })
  }
}

// 更新指定id菜单
exports.update = async (req, res) => {
  try {
    let _id = req.params.id
    let menuDoc = req.body
    const data = await menuModel.findByIdAndUpdate(_id, menuDoc, { new: true })
    if(!data) return res.status(400).json({ msg: '更新失败!' })
    res.status(201).json({
      msg: '更新成功',
      data: data
    })
  } catch (error) {
    console.log(error)
    res.json({
      msg: '更新失败!',
      err: error
    })
  }
}

// 删除指定id菜单
exports.delete = async (req, res) => {
  try {
    let _id = req.params.id
    const data = await menuModel.findByIdAndDelete(_id)
    if(!data) return res.json({ msg: '删除失败!' })
    res.json({ msg: '删除失败!' })
  } catch (error) {
    res.json({
      msg: '删除失败!',
      err: error
    })
  }
}

// 获取指定id角色
exports.one = async (req, res) => {
  try {
    let _id = req.params.id
    const data = await menuModel.findById(_id).populate({
      path: 'children',
      populate: {
        path: 'children'
      }
    })
    if(!data) return res.status(404).json({ msg: '查询失败!' })
    res.status(200).json({
      msg: '查询成功',
      data: data
    })
  } catch (error) {
    res.json({
      msg: '查询失败!',
      err: error
    })
  }
}
