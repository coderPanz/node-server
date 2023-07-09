const md5 = require("md5");

// 导入模型对象
const userModel = require("../models/user");
// 获取用户列表
exports.list = async (req, res) => {
  try {
    const data = await userModel.find();
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

// 创建用户
exports.create = async (req, res) => {
  try {
    let { name, password } = req.body;
    password = md5(password)
    const data = await userModel.create({ name: name, password: password });
    if (!data) return res.status(500).json({ msg: '创建失败!' });
    res.status(201).json({
      msg: '创建成功!',
      data: data
    });
  } catch (error) {
    res.json({
      msg: '创建失败!',
      err: error
    })
  }
};

// 更新指定id用户
exports.update = async (req, res) => {
  try {
    let _id = req.params.id;
    let userDoc = req.body;
    const data = await userModel.findByIdAndUpdate(_id, userDoc, { new: true });
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

// 删除指定id用户
exports.delete = async (req, res) => {
  try {
    let id = req.params.id;
    const data = await userModel.findByIdAndDelete(id);
    if (!data) return res.json({ msg: '删除失败!' });
    res.json({ msg: '删除成功!' });
  } catch (error) {
    res.json({
      msg: '删除失败!',
      err: error
    })
  }
};

// 根据id查询单个用户
exports.one = async (req, res) => {
  try {
    let id = req.params.id;
    const data = await userModel.findById(id);
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

// 给指定id用户分配角色
exports.updateRoles = async (req, res) => {
  try {
    let id = req.params.id;
    let roles = req.body;
    const data = await userModel.findByIdAndUpdate(id, roles);
    if (!data) return res.status(400).json({ msg: '角色分配失败!' });
    res.status(201).json({
      msg: '角色分配成功!',
      data: data,
    });
  } catch (error) {
    res.json({
      msg: '角色分配失败!',
      err: error
    })
  }
};