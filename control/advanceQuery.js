const menuModel = require("../models/menu");
const roleModel = require("../models/role");
const userModel = require('../models/user')
const departmentModel = require('../models/department')
const productTypeModel = require('../models/product/product-type')
const productInfosModel = require('../models/product/product-infos')


// 获取角色对应权限的菜单树
exports.menuTree = async (req, res) => {
  try {
    // 1. 获取角色菜单列表
    let roleId = req.params.id
    const roleData = await roleModel.findById(roleId)
    const roleMenus = roleData.menus

    // 2. 先获取所有菜单树
    const ids = 
      [
        "64a52f2e584f55b8dd09c9ce",
        "64a530ca52e855dee749a2f5",
        "64a53b9922efcc29618d2251",
        "64a53c1b22efcc29618d225a"
      ]

    const allMenus = await menuModel.find({ _id: { $in: ids } }).populate({
      path: 'children',
      populate: {
        path: 'children'
      }
    })

    // 3. 递归菜单树找到角色对应的权限的菜单树
    function getPermissionList(allMenus, roleMenus) {
      let rolePermissionList = [];
      for (const item of allMenus) {
        if(roleMenus.includes(item._id.toString())) {
          const filteredMenu = {
            _id: item._id,
            name: item.name,
            url: item.url,
            icon: item.icon,
            sort: item.sort,
            type: item.type,
            permission: item.permission,
            parentId: item.parentId,
            children: getPermissionList(item.children, roleMenus)
          };
          rolePermissionList.push(filteredMenu)
        }
      }
      return rolePermissionList
    }
    const filteredMenus = getPermissionList(allMenus, roleMenus)
    if(!filteredMenus) return res.status(404).json({ msg: '查询失败!' })
    res.status(200).json({
      msg: '查询成功!',
      data: filteredMenus
    })
  }
  catch (error) {
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
    if(!data) return res.status(500).json({ msg: '查询失败!' })
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
    if(!data) return res.status(500).json({ msg: '查询失败!' })
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
    let { size, offset, id, name, status, createdAt, leader } = req.body;
    // 我先进行一层判断, 如果有值的话就做为查询的条件, 没有值的话就不需要作为查询条件
    const query = {};
    if (id) query._id = id;
    if (name) query.name = name;
    if(status === 1 || status === 0) query.status = status;
    if(leader) query.leader = leader
    if (createdAt) {
      // 获取创建时间的范围
      const startDate = createdAt[0];
      const endDate = createdAt[1];
      query.createdAt = { $gte: startDate, $lte: endDate };
    }
    const data = await departmentModel.find(query).skip(offset).limit(size);
    if(!data) return res.status(500).json({ msg: '查询失败!' })
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
};

exports.productType = async (req, res) => {
  try {
    let { size, offset, id, name, status, createdAt, leader } = req.body;
    // 我先进行一层判断, 如果有值的话就做为查询的条件, 没有值的话就不需要作为查询条件
    const query = {};
    if (id) query._id = id;
    if (name) query.name = name;
    if(status === 1 || status === 0) query.status = status;
    if(leader) query.leader = leader
    if (createdAt) {
      // 获取创建时间的范围
      const startDate = createdAt[0];
      const endDate = createdAt[1];
      query.createdAt = { $gte: startDate, $lte: endDate };
    }
    const data = await productTypeModel.find(query).skip(offset).limit(size);
    if(!data) return res.status(500).json({ msg: '查询失败!' })
    // 查询符合条件的文档总数
    const totalCount = await productTypeModel.countDocuments();
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

exports.productInfos = async (req, res) => {
  try {
    let { size, offset, id, name, status, createdAt, leader } = req.body;
    // 我先进行一层判断, 如果有值的话就做为查询的条件, 没有值的话就不需要作为查询条件
    const query = {};
    if (id) query._id = id;
    if (name) query.name = name;
    if(status === 1 || status === 0) query.status = status;
    if(leader) query.leader = leader
    if (createdAt) {
      // 获取创建时间的范围
      const startDate = createdAt[0];
      const endDate = createdAt[1];
      query.createdAt = { $gte: startDate, $lte: endDate };
    }
    const data = await productInfosModel.find(query).skip(offset).limit(size);
    if(!data) return res.status(500).json({ msg: '查询失败!' })
    // 查询符合条件的文档总数
    const totalCount = await productInfosModel.countDocuments();
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



