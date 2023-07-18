const express = require('express')
const router = express.Router()
// 导入验证规则对象
const { formCheckObj } = require('../models/validate')
// 安装 @escook/express-joi 中间件，来实现自动对表单数据进行验证的功能
const expressJoi = require('@escook/express-joi')
const validataUser = expressJoi(formCheckObj)

// 用户登录路由分发
const loginAdmin = require('../control/login')
router.post('/login', validataUser, loginAdmin.login)
 
// 1、用户管理路由分发
const usersAdmin = require('../control/user')
router
  .get('/user', usersAdmin.list) // 获取用户列表
  .post('/user', validataUser, usersAdmin.create) // 创建用户
  .patch('/user/:id', usersAdmin.update) // 更新指定id用户, 更新的时候是部分更新所以不需要使用验证规则中间件(比如前端只修改名字, 密码不变)
  .delete('/user/:id', usersAdmin.delete) // 删除指定id用户
  .post('/user/:id', usersAdmin.one) // 获取指定id用户
  .patch('/user/:id/roles', usersAdmin.updateRoles) // 给指定id用户分配角色


// 2. 角色管理路由分发
const rolesAdmin = require('../control/role')
router
  .get('/role', rolesAdmin.list) // 获取角色列表
  .post('/role', rolesAdmin.create) // 创建角色
  .patch('/role/:id', rolesAdmin.update) // 更新指定id角色
  .delete('/role/:id', rolesAdmin.delete) // 删除指定id角色
  .get('/role/:id', rolesAdmin.one) // 获取指定id角色
  .patch('/role/:id/menu', rolesAdmin.updateRoles) // 给指定id角色分配权限


// 3. 部门管理
const departmentAdmin = require('../control/department')
router
  .get('/department', departmentAdmin.list) // 获取部门列表
  .post('/department', departmentAdmin.create) // 创建部门
  .patch('/department/:id', departmentAdmin.update) // 更新部门
  .delete('/department/:id', departmentAdmin.delete) // 删除部门
  .get('/department/:id', departmentAdmin.one) // 查询指定部门

// 4. 权限管理路由分发(菜单权限)
const menusAdmin = require('../control/menu')
router
  .get('/menu', menusAdmin.list) // 获取权限列表
  .post('/menu', menusAdmin.create) // 创建权限
  .patch('/menu/:id', menusAdmin.update) // 更新指定id菜单
  .delete('/menu/:id', menusAdmin.delete) // 删除指定id菜单
  .get('/menu/:id', menusAdmin.one) // 查询某个菜单


// 高级查询
const advanceQuery = require('../control/advanceQuery')
router
.get('/role/:id/menu', advanceQuery.menuTree) // 获取角色菜单树
// 注意这里的空出的这个位置为:id, 我们没有加入动态id所以需要留一个占位
.post('/user//paginationQuery', advanceQuery.userQuery) 
.post('/role//paginationQuery', advanceQuery.roleQuery)
.post('/department//paginationQuery', advanceQuery.departmentQuery)
.post('/menu//paginationQuery', advanceQuery.menuQuery)
module.exports = router