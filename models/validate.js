// 表单验证--前端为辅, 后端为主
// 1.导入joi为表单中携带的每个数据项，定义验证规则
const joi = require("joi");

// 用户名的验证规则
const name = joi
  .string()
  .min(3)
  .max(12)
  .required()
  .pattern(/^[\u4e00-\u9fa5a-zA-Z0-9]+$/);

// 密码验证规则
const password = joi
  .string()
  .pattern(/^(?=.*[a-zA-Z])(?=.*\d).{3,8}$/)
  .min(3)
  .max(12)
  .required();

// 向外共享表单验证规则对象
exports.formCheckObj = {
  // 校验req.body中的数据
  body: {
    name,
    password
  }
  // 校验req.query中的数据
  // 校验req.params中的数据
}
