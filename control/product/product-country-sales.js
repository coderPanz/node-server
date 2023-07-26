const productCountSalesModel = require('../../models/product/product-country-sales')

exports.list = async (req, res) => {
  try {
    const data = await productCountSalesModel.find();
    if (!data) return res.status(404).json({ msg: "查询失败!" });
    res.status(200).json({
      msg: "查询成功!",
      data: data,
    });
  } catch (error) {
    res.json({
      msg: "查询失败!",
      err: error,
    });
  }
}

exports.create = async (req, res) => {
  try {
    let productCountDoc = req.body
    const data = await productCountSalesModel.create(productCountDoc);
    if (!data) return res.status(404).json({ msg: "创建失败!" });
    res.status(200).json({
      msg: "创建成功!",
      data: data,
    });
  } catch (error) {
    res.json({
      msg: "创建失败!",
      err: error,
    });
  }
}