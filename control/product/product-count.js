const productCountModel = require("../../models/product/product-count")
const productCountSalesModel = require("../../models/product/product-country-sales")

exports.list = async (req, res) => {
  try {
    const data = await productCountModel.find()
    if (!data) return res.status(404).json({ msg: "查询失败!" })
    res.status(200).json({
      msg: "查询成功!",
      data: data,
      status: 200,
    })
  } catch (error) {
    res.json({
      msg: "查询失败!",
      err: error,
    })
  }
}

exports.create = async (req, res) => {
  try {
    let productCountDoc = req.body
    const data = await productCountModel.create(productCountDoc)
    if (!data) return res.status(404).json({ msg: "创建失败!" })
    res.status(200).json({
      msg: "创建成功!",
      data: data,
    })
  } catch (error) {
    res.json({
      msg: "创建失败!",
      err: error,
    })
  }
}

exports.update = async (req, res) => {
  let _id = req.params.id
  let productCountDoc = req.body
  const obj = {
    title: productCountDoc.title,
    subTitle: productCountDoc.title,
    number1: productCountDoc.number1,
    number2: productCountDoc.number1,
    tips: productCountDoc.tips,
  }
  const data = await productCountModel.findByIdAndUpdate(_id, obj)
  console.log("datga", data)
  if (!data) return res.status(404).json({ msg: "更新失败!" })
  res.status(200).json({
    msg: "上报成功!",
    data: data,
    status: 200,
  })
}

// 更新城市销售数据
exports.country = async (req, res) => {
  const { city, count } = req.body
  // 查找并更新城市销售数据
  const data = await productCountSalesModel.findOneAndUpdate(
    { address: city },
    { $set: { count: count } },
    { new: true }
  )
  if (!data) {
    // 如果没有找到对应城市的数据，创建新记录
    await productCountSalesModel.create({
      address: city,
      count: count
    })
  }
  res.status(200).json({
    msg: "更新成功!",
    data: data,
    status: 200,
  })
}
