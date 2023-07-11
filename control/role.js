// 导入模型对象
const roleModel = require("../models/role");

// 获取角色列表`
exports.list = async (req, res) => {
  try {
    const data = await roleModel.find();
    if (!data) return res.status(404).json({ msg: '查询失败!' });
    res.status(200).json({
      msg: '查询成功!',
      data: data,
    });
  } catch (error) {
    res.json({
      msg: '查询失败!',
      err: error
    })
  }
};

// 创建角色
exports.create = async (req, res) => {
  try {
    let roleDoc = req.body;
    const data = await roleModel.create(roleDoc);
    if (!data) return res.status(500).json({ msg: '创建失败!' });
    res.status(201).json({
      msg: '创建成功!',
      data: data,
    });
  } catch (error) {
    res.json({
      msg: '创建失败!',
      err: error
    })
  }
};

// 更新指定id角色
exports.update = async (req, res) => {
  try {
    let _id = req.params.id;
    let roleDoc = req.body;
    const data = await roleModel.findByIdAndUpdate(_id, roleDoc, { new: true });
    if (!data) return res.status(400).json({ msg: '更新失败!' });
    res.status(201).json({
      msg: '更新成功!',
      data: data,
    });
  } catch (error) {
    res.json({
      msg: '更新失败!',
      err: error
    })
  }
};

// 删除指定id角色
exports.delete = async (req, res) => {
  try {
    let _id = req.params.id;
    const data = await roleModel.findByIdAndDelete(_id);
    if (!data) return res.json({ msg: '删除失败!' });
    res.json({ msg: '删除成功!' });
  } catch (error) {
    res.json({
      msg: '删除失败!',
      err: error
    })
  }
};

// 获取指定id角色
exports.one = async (req, res) => {
  try {
    let _id = req.params.id
    const data = await roleModel.findById(_id);
    if (!data) return res.status(404).json({ msg: '查询失败!' });
    res.status(200).json({
      msg: '查询成功!',
      data: data,
    });
  } catch (error) {
    console.log(error)
    res.json({
      msg: '查询失败!',
      err: error
    })
  }
};

// 给指定id角色分配角色
exports.updateRoles = async (req, res) => {
  try {
    let _id = req.params.id;
    let roleDoc = req.body;
    const data = await roleModel.findByIdAndUpdate(_id, roleDoc)
    if (!data) return res.status(400).json({ msg: '权限分配失败!' });
    res.status(201).json({
      msg: '权限分配成功!',
      data: data
    });
  } catch (error) {
    res.json({
      msg: '权限分配失败!',
      err: error
    })
  }
};
