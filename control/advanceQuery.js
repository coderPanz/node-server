const menuModel = require("../models/menu");
const roleModel = require("../models/role");
const userModel = require('../models/user')
const departmentModel = require('../models/department')

// 获取角色菜单树, 在服务器操作返回前端数据即可, 而不是在前端进行频繁的循环查询
exports.menuTree = async (req, res) => {
  try {
    let _id = req.params.id;
    const data = await roleModel.findById(_id)
    if(!data) return res.status(404).json({ msg: '查询失败!' })

    const menuIdList = data.menus;
    menuModel.find({ _id: { $in: menuIdList } }).then(data => {
      res.json({
        data: data,
        msg: '查询成功!'
      })
    })

  } catch (error) {
    res.json({
      msg: '服务器异常!',
      err: error
    })
  }
};

// 按条件查询: 根据前端的特定条件进行查询
// 分页查询
exports.userQuery = async (req, res) => {
  try {
    let { size, offset, id, name, status, createdAt } = req.body;
    // 我先进行一层判断, 如果有值的话就做为查询的条件, 没有值的话就不需要作为查询条件
    const query = {};
    if (id) query._id = id;
    if (name) query.name = name;
    if(status === 1 || status === 0) query.status = status;
    if (createdAt) {
      // 获取创建时间的范围
      const startDate = createdAt[0];
      const endDate = createdAt[1];
      query.createdAt = { $gte: startDate, $lte: endDate };
    }
    const data = await userModel.find(query).skip(offset).limit(size);

    // 查询符合条件的文档总数
    const totalCount = await userModel.countDocuments();
    res.json({
      msg: '查询成功!',
      data: data,
      totalCount: totalCount,
    })
  } catch (error) {
    res.json({
      msg: '服务器异常!',
      err: error
    })
  }
};

exports.roleQuery = async (req, res) => {
  try {
    let { size, offset, id, name, status, createdAt } = req.body;
    // 我先进行一层判断, 如果有值的话就做为查询的条件, 没有值的话就不需要作为查询条件
    const query = {};
    if (id) query._id = id;
    if (name) query.name = name;
    if(status === 1 || status === 0) query.status = status;
    if (createdAt) {
      // 获取创建时间的范围
      const startDate = createdAt[0];
      const endDate = createdAt[1];
      query.createdAt = { $gte: startDate, $lte: endDate };
    }
    const data = await roleModel.find(query).skip(offset).limit(size);

    // 查询符合条件的文档总数
    const totalCount = await roleModel.countDocuments();
    res.json({
      msg: '查询成功!',
      data: data,
      totalCount: totalCount,
    })
  } catch (error) {
    res.json({
      msg: '服务器异常!',
      err: error
    })
  }
};

exports.departmentQuery = async (req, res) => {
  try {
    let { size, offset, id, name, status, createdAt } = req.body;
    // 我先进行一层判断, 如果有值的话就做为查询的条件, 没有值的话就不需要作为查询条件
    const query = {};
    if (id) query._id = id;
    if (name) query.name = name;
    if(status === 1 || status === 0) query.status = status;
    if (createdAt) {
      // 获取创建时间的范围
      const startDate = createdAt[0];
      const endDate = createdAt[1];
      query.createdAt = { $gte: startDate, $lte: endDate };
    }
    const data = await departmentModel.find(query).skip(offset).limit(size);

    // 查询符合条件的文档总数
    const totalCount = await departmentModel.countDocuments();
    res.json({
      msg: '查询成功!',
      data: data,
      totalCount: totalCount,
    })
  } catch (error) {
    res.json({
      msg: '服务器异常!',
      err: error
    })
  }
};

exports.menuQuery = async (req, res) => {
  try {
    let { size, offset, id, name, status, createdAt } = req.body;
    // 我先进行一层判断, 如果有值的话就做为查询的条件, 没有值的话就不需要作为查询条件
    const query = {};
    if (id) query._id = id;
    if (name) query.name = name;
    if(status === 1 || status === 0) query.status = status;
    if (createdAt) {
      // 获取创建时间的范围
      const startDate = createdAt[0];
      const endDate = createdAt[1];
      query.createdAt = { $gte: startDate, $lte: endDate };
    }
    const data = await menuModel.find(query).skip(offset).limit(size);

    // 查询符合条件的文档总数
    const totalCount = await menuModel.countDocuments();
    res.json({
      msg: '查询成功!',
      data: data,
      totalCount: totalCount,
    })
  } catch (error) {
    res.json({
      msg: '服务器异常!',
      err: error
    })
  }
};


