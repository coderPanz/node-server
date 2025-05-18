const menuModel = require("../models/menu")
const roleModel = require("../models/role")
const userModel = require("../models/user")
const departmentModel = require("../models/department")
const productTypeModel = require("../models/product/product-type")
const productInfosModel = require("../models/product/product-infos")
const mongoose = require("mongoose")

// 获取角色对应权限的菜单树
exports.menuTree = async (req, res) => {
  try {
    // 1. 获取角色菜单列表
    let roleId = req.params.id
    const roleData = await roleModel.findById(roleId)
    const roleMenus = roleData.menus

    // 2. 先获取所有菜单树
    const ids = [
      "64a52f2e584f55b8dd09c9ce",
      "64a530ca52e855dee749a2f5",
      "64a53b9922efcc29618d2251",
      "64a53c1b22efcc29618d225a",
    ]

    const allMenus = await menuModel.find({ _id: { $in: ids } }).populate({
      path: "children",
      populate: {
        path: "children",
      },
    })

    // 3. 递归菜单树找到角色对应的权限的菜单树
    function getPermissionList(allMenus, roleMenus) {
      let rolePermissionList = [] // 避免循环依赖, 该变量不能放在函数外面
      for (const item of allMenus) {
        if (roleMenus.includes(item._id.toString())) {
          const filteredMenu = {
            _id: item._id,
            name: item.name,
            url: item.url,
            icon: item.icon,
            sort: item.sort,
            type: item.type,
            permission: item.permission,
            parentId: item.parentId,
            children: getPermissionList(item.children, roleMenus),
          }
          rolePermissionList.push(filteredMenu)
        }
      }
      return rolePermissionList
    }
    const filteredMenus = getPermissionList(allMenus, roleMenus)
    if (!filteredMenus) return res.status(404).json({ msg: "查询失败!" })
    res.status(200).json({
      msg: "查询成功!",
      data: filteredMenus,
    })
  } catch (error) {
    res.json({
      msg: "服务器异常!",
      err: error,
    })
  }
}

// 按条件查询: 根据前端的特定条件进行查询
// 分页查询

exports.userQuery = async (req, res) => {
  try {
    let { size, offset, id, name, status, createdAt, rolesId, departmentId } =
      req.body
    let handleData
    // 我先进行一层判断, 如果有值的话就做为查询的条件, 没有值的话就不需要作为查询条件
    const query = {}
    if (id) query._id = id
    if (name) query.name = { $regex: name, $options: 'i' } // 使用正则表达式实现模糊查询,i表示不区分大小写
    if (status === 1 || status === 0) query.status = status
    if (createdAt) {
      // 获取创建时间的范围
      const startDate = createdAt[0]
      const endDate = createdAt[1]
      query.createdAt = { $gte: startDate, $lte: endDate }
    }
    // 添加对rolesId和departmentId的查询条件
    if (rolesId) {
      // 根据角色名称查找对应的角色ID
      const role = await roleModel.findOne({ name: rolesId })
      if (role) {
        const user_role = await userModel
          .find({
            rolesId: role._id,
          })
          .skip(offset)
          .limit(size)
          .populate({
            path: "rolesId",
            select: "name description", // 只返回角色名称和描述
          })
          .populate({
            path: "departmentId",
            select: "name leader", // 只返回部门名称和负责人
          })

        handleData = user_role.map(item => {
          return {
            _id: item._id,
            name: item.name,
            status: item.status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            __v: item.__v,
            rolesId: item.rolesId.map(item => item.name)[0],
            departmentId: item.departmentId.map(item => item.name)[0],
          }
        })

        // 查询符合条件的文档总数
        const totalCount = await userModel.countDocuments(query)
        return res.json({
          msg: "查询成功!",
          data: handleData,
          totalCount: totalCount,
        })
      } else {
        return res.json({ msg: "查询失败!", data: [], totalCount: 0 })
      }
    }
    if (departmentId) {
      const department = await departmentModel.findOne({ name: departmentId })
      console.log("department", department)
      if (department) {
        const user_department = await userModel
          .find({
            departmentId: department._id,
          })
          .skip(offset)
          .limit(size)
          .populate({
            path: "rolesId",
            select: "name",
          })
          .populate({
            path: "departmentId",
            select: "name leader", // 只返回部门名称和负责人
          })
        console.log("user_department", user_department)
        handleData = user_department.map(item => {
          return {
            _id: item._id,
            name: item.name,
            status: item.status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            __v: item.__v,
            rolesId: item.rolesId.map(item => item.name)[0],
            departmentId: item.departmentId.map(item => item.name)[0],
          }
        })
        // 查询符合条件的文档总数
        const totalCount = await userModel.countDocuments(query)
        return res.json({
          msg: "查询成功!",
          data: handleData,
          totalCount: totalCount,
        })
      } else {
        return res.json({ msg: "查询失败!", data: [], totalCount: 0 })
      }
    }
    // 查询用户数据并关联查询角色和部门信息
    const data = await userModel
      .find(query)
      .skip(offset)
      .limit(size)
      .populate({
        path: "rolesId",
        select: "name description", // 只返回角色名称和描述
      })
      .populate({
        path: "departmentId",
        select: "name leader", // 只返回部门名称和负责人
      })

    handleData = data.map(item => {
      return {
        _id: item._id,
        name: item.name,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        __v: item.__v,
        rolesId: item.rolesId.map(item => item.name)[0],
        departmentId: item.departmentId.map(item => item.name)[0],
      }
    })
    if (!data) return res.status(500).json({ msg: "查询失败!" })

    // 查询符合条件的文档总数
    const totalCount = await userModel.countDocuments(query)

    res.json({
      msg: "查询成功!",
      data: handleData,
      totalCount: totalCount,
    })
  } catch (error) {
    res.json({
      msg: "服务器异常!",
      err: error,
    })
  }
}

exports.roleQuery = async (req, res) => {
  try {
    let { size, offset, id, name, status, createdAt } = req.body

    // 我先进行一层判断, 如果有值的话就做为查询的条件, 没有值的话就不需要作为查询条件
    const query = {}
    if (id) query._id = id
    if (name) query.name = { $regex: name, $options: "i" } // 使用正则表达式实现模糊查询,i表示不区分大小写
    if (status === 1 || status === 0) query.status = status
    if (createdAt) {
      // 获取创建时间的范围
      const startDate = createdAt[0]
      const endDate = createdAt[1]
      query.createdAt = { $gte: startDate, $lte: endDate }
    }
    const data = await roleModel.find(query).skip(offset).limit(size)
    if (!data) return res.status(500).json({ msg: "查询失败!" })
    // 查询符合条件的文档总数
    const totalCount = await roleModel.countDocuments()
    res.json({
      msg: "查询成功!",
      data: data,
      totalCount: totalCount,
    })
  } catch (error) {
    res.json({
      msg: "服务器异常!",
      err: error,
    })
  }
}

exports.departmentQuery = async (req, res) => {
  try {
    let { size, offset, id, name, status, createdAt, leader, parentId } =
      req.body
    if (parentId) {
      const department = await departmentModel.findOne({
        name: parentId,
      })
      if (department) {
        const user_department = await departmentModel
          .find({
            parentName: department.name,
          })
          .skip(offset)
          .limit(size)
        console.log("user_department", user_department)
        // 查询符合条件的文档总数
        const totalCount = await userModel.countDocuments()
        return res.json({
          msg: "查询成功!",
          data: user_department,
          totalCount: totalCount,
        })
      } else {
        return res.json({ msg: "查询失败!", data: [], totalCount: 0 })
      }

    }
    // 我先进行一层判断, 如果有值的话就做为查询的条件, 没有值的话就不需要作为查询条件
    const query = {}
    if (id) query._id = id
    if (name) query.name = { $regex: name, $options: 'i' } // 使用正则表达式实现模糊查询,i表示不区分大小写
    if (status === 1 || status === 0) query.status = status
    if (leader) query.leader = leader
    if (createdAt) {
      // 获取创建时间的范围
      const startDate = createdAt[0]
      const endDate = createdAt[1]
      query.createdAt = { $gte: startDate, $lte: endDate }
    }
    const data = await departmentModel.find(query).skip(offset).limit(size)
    if (!data) return res.status(500).json({ msg: "查询失败!" })

    // 查询符合条件的文档总数
    const totalCount = await departmentModel.countDocuments()
    res.json({
      msg: "查询成功!",
      data: data,
      totalCount: totalCount,
    })
  } catch (error) {
    res.json({
      msg: "服务器异常!",
      err: error,
    })
  }
}

exports.menuQuery = async (req, res) => {
  try {
    // 因为所有菜单都集中在一个表中, 所以我们只需要查找主菜单, 子菜单使用poplate来填充
    const ids = [
      "64a52f2e584f55b8dd09c9ce",
      "64a530ca52e855dee749a2f5",
      "64a53b9922efcc29618d2251",
      "64a53c1b22efcc29618d225a",
    ]
    const data = await menuModel.find({ _id: { $in: ids } }).populate({
      path: "children",
      populate: {
        path: "children",
      },
    })
    if (!data) return res.status(404).json({ msg: "查询失败!" })
    res.status(200).json({
      msg: "查询成功",
      data: data,
    })
  } catch (error) {
    res.json({
      msg: "查询失败!",
      err: error,
    })
  }
}

exports.productType = async (req, res) => {
  try {
    let { size, offset, id, name, status, createdAt, leader } = req.body
    // 我先进行一层判断, 如果有值的话就做为查询的条件, 没有值的话就不需要作为查询条件
    const query = {}
    if (id) query._id = id
    if (name) query.name = name
    if (status === 1 || status === 0) query.status = status
    if (leader) query.leader = leader
    if (createdAt) {
      // 获取创建时间的范围
      const startDate = createdAt[0]
      const endDate = createdAt[1]
      query.createdAt = { $gte: startDate, $lte: endDate }
    }
    const data = await productTypeModel.find(query).skip(offset).limit(size)
    if (!data) return res.status(500).json({ msg: "查询失败!" })
    // 查询符合条件的文档总数
    const totalCount = await productTypeModel.countDocuments()
    res.json({
      msg: "查询成功!",
      data: data,
      totalCount: totalCount,
    })
  } catch (error) {
    res.json({
      msg: "服务器异常!",
      err: error,
    })
  }
}

exports.productInfos = async (req, res) => {
  try {
    let { size, offset, id, name, status, createdAt, leader, price } = req.body // 我先进行一层判断, 如果有值的话就做为查询的条件, 没有值的话就不需要作为查询条件
    const query = {}
    if (id) query._id = id
    if (name) query.name = name
    if (status === 1 || status === 0) query.status = status
    if (leader) query.leader = leader
    if (createdAt) {
      // 获取创建时间的范围
      const startDate = createdAt[0]
      const endDate = createdAt[1]
      query.createdAt = { $gte: startDate, $lte: endDate }
    }
    if (price) {
      // 获取价格区间
      const handlePrice = price.split("-")
      const minPrice = Number(handlePrice[0])
      const maxPrice =
        handlePrice[1] === "max"
          ? Number.MAX_SAFE_INTEGER
          : Number(handlePrice[1])

      // 设置价格查询条件
      query.price = {
        $gte: minPrice,
        $lte: maxPrice,
      }

      // 添加日志用于调试价格查询
      console.log("Price query:", query.price)
      console.log("Sample document:", await productInfosModel.findOne())
    }

    // 添加日志用于调试最终查询条件
    console.log("Final query:", query)

    const data = await productInfosModel.find(query).skip(offset).limit(size)

    // 添加日志用于检查查询结果
    console.log("Query result length:", data.length)
    if (data.length === 0) {
      console.log("No results found with current query")
      // 进行一次不带价格条件的测试查询
      const testQuery = { ...query }
      delete testQuery.price
      const testData = await productInfosModel.find(testQuery)
      console.log(
        "Test query without price returns:",
        testData.length,
        "results"
      )
    }

    if (!data) return res.status(500).json({ msg: "查询失败!" })

    // 查询符合条件的文档总数
    const totalCount = await productInfosModel.countDocuments(query)

    res.json({
      msg: "查询成功!",
      data: data,
      totalCount: totalCount,
    })
  } catch (error) {
    console.error("Error in productInfos query:", error)
    res.json({
      msg: "服务器异常!",
      err: error,
    })
  }
}
