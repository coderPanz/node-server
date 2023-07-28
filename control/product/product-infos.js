const productInfosModel = require("../../models/product/product-infos");
const productTypeModel = require("../../models/product/product-type");

exports.list = async (req, res) => {
  try {
    const data = await productInfosModel.find();
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
};

exports.create = async (req, res) => {
  try {
    let productInfos = req.body;
    // 对数据进行处理, 把_id对应的文档的name赋值该type
    const newObj = {};
    for (const key in productInfos) {
      if (key === "type") {
        const _id = productInfos[key];
        const data = await productTypeModel.findById(_id);
        newObj[key] = data.name;
      }
      if (
        key !== "__v" &&
        key !== "updatedAt" &&
        key !== "createdAt" &&
        key !== "_id" &&
        key !== "type"
      ) {
        newObj[key] = productInfos[key];
      }
    }
    const data = await productInfosModel.create(newObj);
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
};

exports.update = async (req, res) => {
  try {
    let _id = req.params.id;
    let productTypeDoc = req.body;
    // console.log(productTypeDoc);
    // 对数据进行处理, 把_id对应的文档的name赋值该type
    const newObj = {};
    for (const key in productTypeDoc) {
        // 由于前端的点击编辑回显操作会使得type为具体的名称而不是_id, 所以需要更新时判断type的value是否为_id才进行这一步, 因为_id的的长度永远为24, 所以我们利用这个特性来判断type为name还是_id
      if (key === "type" & productTypeDoc[key].length === 24) {
        const isType = productTypeDoc[key]
        const _id = productTypeDoc[key];
        const data = await productTypeModel.findById(_id);
        newObj[key] = data.name;
      }
      if (
        (key !== "__v") & (key !== "updatedAt") &&
        key !== "createdAt" &&
        key !== "_id" &&
        key !== "type"
      ) {
        newObj[key] = productTypeDoc[key];
      }
    }
    // console.log(newObj)
    const data = await productInfosModel.findByIdAndUpdate(_id, newObj, {
      new: true,
    });
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
};

exports.delete = async (req, res) => {
  try {
    let _id = req.params.id;
    const data = await productInfosModel.findByIdAndDelete(_id);
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
};
