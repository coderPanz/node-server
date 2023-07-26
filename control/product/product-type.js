const productTypeModel = require('../../models/product/product-type')

exports.list = async (req, res) => {
  try {
    const data = await productTypeModel.find();
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
    const data = await productTypeModel.create(productCountDoc);
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

exports.update = async (req, res) => {
  try {
    let _id = req.params.id;
    let productTypeDoc = req.body;
    const data = await productTypeModel.findByIdAndUpdate(_id, productTypeDoc, { new: true });
    if (!data) return res.status(404).json({ msg: "更新失败!" });
    res.status(200).json({
      msg: "更新成功!",
      data: data,
    });
  } catch (error) {
    res.json({
      msg: "更新失败!",
      err: error,
    });
  }
}

exports.delete = async (req, res) => {
  try {
    let _id = req.params.id;
    const data = await productTypeModel.findByIdAndDelete(_id);
    if (!data) return res.status(404).json({ msg: "删除失败!" });
    res.status(200).json({
      msg: "删除成功!",
      data: data,
    });
  } catch (error) {
    res.json({
      msg: "删除失败!",
      err: error,
    });
  }
}