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

// 1. 根据角色权限获取菜单树
exports.menuQuery = async (req, res) => {
  try {
    // 1. 先获取所有菜单树
    const ids = ["64a52f2e584f55b8dd09c9ce", "64a530ca52e855dee749a2f5", "64a53b9922efcc29618d2251", "64a53c1b22efcc29618d225a"];

    const menus = await menuModel.find({ _id: { $in: ids } }).populate({
      path: 'children',
      populate: {
        path: 'children'
      }
    })
    // 2. 递归菜单树找到角色对应的权限的菜单树
    let menuList = ["64a530ca52e855dee749a2f5", "64ba8b0b62b31b419e07061a" ]
    // let rolePermissionList = []
    // const menuss = [
    //   {
    //   name: "nihao",
    //   _id: "64a52f2e584f55b8dd09c9ce",
    //   children: [
    //     {
    //       name: "kobe",
    //       _id: "64ba8b0b62b31b419e07061a"
    //     }
    //   ]
    //   }
    // ]
    function getPermissionList(menus, menuList) {
      let rolePermissionList = [];
      for (const item of menus) {
        if(menuList.includes(item._id.toString())) {
          const filteredMenu = {
            _id: item._id,
            name: item.name,
            url: item.url,
            icon: item.icon,
            sort: item.sort,
            type: item.type,
            permission: item.permission,
            parentId: item.parentId,
            children: [getPermissionList(item.children, menuList)]
          };
          rolePermissionList.push(filteredMenu)
        }
      }
      return rolePermissionList
    }

    const filteredMenus = getPermissionList(menus, menuList)
    console.log(filteredMenus)
    res.json({
      data: filteredMenus
    })
    // let menuList = ["64a530ca52e855dee749a2f5",  "64ba8ccf62b31b419e070634"]
    // if(!data) return res.status(404).json({ msg: '查询失败!' })
    // res.status(200).json({
    //   msg: '查询成功',
    //   data: data
    // })
  }
  catch (error) {
  res.json({
    msg: '服务器异常!',
    err: error
  })
}
};


// 定义聚合管道查询的函数
// async function getMenuTreeByIds(menuIds) {
//   const pipeline = [
//     // 匹配指定的菜单节点
//     { $match: { _id: { $in: menuIds } } },
//     // 将children字段转成对象ID数组
//     { $addFields: { children: { $ifNull: ['$children', []] } } },
//     { $addFields: { children: { $map: { input: '$children', in: { $toObjectId: '$$this' } } } } },
//     // 递归查询子菜单节点
//     {
//       $graphLookup: {
//         from: 'menus',
//         startWith: '$_id',
//         connectFromField: '_id',
//         connectToField: 'parentId',
//         as: 'children',
//         maxDepth: 10,
//       },
//     },
//     // 排序菜单节点
//     { $sort: { sort: 1 } },
//   ];

//   // 执行聚合查询并返回结果
//   return Menu.aggregate(pipeline);
// }

// 示例用法
// const menuIds = [
//   '64a52f2e584f55b8dd09c9ce',
//   '64ba1910f2f00d5ca895261b',
// ];

// getMenuTreeByIds(menuIds)
//   .then(result => {
//     console.log(result);
//   })
//   .catch(error => {
//     console.error(error);
//   });



