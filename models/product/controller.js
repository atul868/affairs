const _ = require('lodash');
const config = require('config');
const ProductModel = require('./schema');
const ParentProduct = require('../parent-product/schema');
// const Category = require('../category/schema');
const { Schema } = mongoose;
const productFacade = require('./facade');
const fileUtil = require('../../utils/file');

class ProductController {
  async create(req, res, next) {
    let product;
    let parent;
    const {
      name,
      measuringUnit,
      inStockQuantity,
      contentQuantity,
      visible,
      parentProduct,
      isPrimary,
      dosageSize,
      description,
      price,
      pieces,
      packagingSize,
      images,
      isFeatured
    } = req.body;
    try {
      parent = await ParentProduct.findById(parentProduct);
    } catch (err) {
      return next(err);
    }
    if (!parent) {
      const e = new Error('Parent Does Not exists');
      e.statusCode = 400;
      return next(e);
    }
    try {
      product = await ProductModel.findOne({ name, dosageSize });
    } catch (err) {
      return next(err);
    }
    if (product) {
      const e = new Error('Product Already exists');
      e.statusCode = 400;
      return next(e);
    }
    try {
      product = await ProductModel.create({
        name,
        measuringUnit,
        inStockQuantity,
        contentQuantity,
        visible,
        parentProduct,
        isPrimary,
        dosageSize,
        description,
        price,
        pieces,
        packagingSize,
        images,
        isFeatured
      });
    } catch (err) {
      return next(err);
    }
    parent.products.push(product._id);
    if (isPrimary) {
      parent.primaryProduct = product._id;
    }
    await parent.save();
    res.send(product);
  }

  async edit(req, res, next) {
    const { ProductId } = req.params;
    let parent;
    const d = {
      name: null,
      measuringUnit: null,
      inStockQuantity: null,
      contentQuantity: null,
      visible: null,
      parentProduct: null,
      isPrimary: null,
      dosageSize: null,
      description: null,
      price: null,
      pieces: null,
      packagingSize: null,
      images: null,
      isFeatured: null,
    };

    for (const key in d) {
      d[key] = req.body[key];
    }
    const obj = _.pickBy(d, h => !_.isUndefined(h));

    try {
      await ProductModel.update({ _id: ProductId }, obj);
    } catch (err) {
      return next(err);
    }
    if (req.body.isPrimary) {
      try {
        parent = await ParentProduct.findById(req.body.parentProduct);
      } catch (err) {
        return next(err);
      }
      parent.primaryProduct = ProductId;
      try {
        await ProductModel.updateMany(
          { _id: { $ne: ProductId }, isPrimary: true, parentProduct: parent._id },
          { isPrimary: false }
        );
        await parent.save();
      } catch (error) {
        return next(error);
      }
    }
    res.json({ message: 'Product Updated' });
  }

  async getProduct(req, res, next) {
    let product;
    const { ProductId } = req.params;
    try {
      product = await ProductModel.findOne({ _id: ProductId, isDeleted: false }).populate(
        'measuringUnit parentProduct scheme'
      );
    } catch (err) {
      return next(err);
    }
    if (!product) {
      const e = new Error('Product Does Not exists');
      e.statusCode = 400;
      return next(e);
    }
    res.send(product);
  }

  // async select(req, res, next) {
  //   let products;
  //   let { page, limit, sortBy, isFeatured, isNewArrival } = req.query;
  //   const { search, categoryId, subCategoryId, visible, min, max } = req.query;
  //   let meta;
  //   const query = {};
  //   let skip = 0;
  //   page = parseInt(page, 10) || 1;
  //   limit = parseInt(limit, 10) || config.get('pagination').size;
  //   skip = (page - 1) * limit;

  //   if (sortBy) {
  //     sortBy = sortBy || req.query.sortBy;
  //   } else {
  //     sortBy = sortBy || { '_id': -1 };
  //   }

  //   if (isNewArrival == true) {
  //     sortBy = { '_id': -1 };
  //   }

  //   if (search) {
  //     query.name = {
  //       $regex: new RegExp(search.toLowerCase().replace(/\s+/g, '\\s+'), 'gi')
  //     };
  //   }

  //   if (min || max) {
  //     query.price = { $gte: parseInt(min), $lte: parseInt(max) };
  //   }

  //   if (visible) query.visible = true;
  //   if (categoryId) query.category = categoryId;
  //   if (subCategoryId) query.subCategory = subCategoryId;
  //   query.isDeleted = {
  //     $ne: true
  //   };
  //   if (isFeatured) query.isFeatured = true;
  //   // query.push({
  //   //   $match: { isDelete: false },
  //   // },
  //   //   {
  //   //     $lookup: {
  //   //       localField: "student",
  //   //       foreignField: "_id",
  //   //       from: "users",
  //   //       as: "studentInfo"
  //   //     }
  //   //   },
  //   //   { $sort: { _id: -1 } },
  //   // );
  //   try {
  //     // products = await ProductModel.aggregate(query)
  //     products = await ProductModel.find(query)
  //       .populate('measuringUnit scheme')
  //       .populate({
  //         path: 'parentProduct',
  //         populate: {
  //           path: 'category',
  //           // select:'_id',
  //           match: { _id: { $eq: mongoose.Types.ObjectId(categoryId) } }
  //         }
  //       })
  //       .sort(sortBy)
  //       .skip(skip)
  //       .limit(limit);
  //   } catch (err) {
  //     return next(err);
  //   }
  //   const dataToSend = {
  //     data: products
  //   };
  //   if (page === 1) {
  //     meta = {
  //       currentPage: page,
  //       recordsPerPage: limit,
  //       totalRecords: await ProductModel.find(query).count()
  //     };
  //     meta.totalPages = Math.ceil(meta.totalRecords / meta.recordsPerPage);
  //     dataToSend.meta = meta;
  //   }
  //   res.send(dataToSend);
  // }

  async select(req, res, next) {
    let products;
    let { page, limit, sortBy, isFeatured, isNewArrival,isDeleted } = req.query;
    const { search, categoryId, subCategoryId, visible, min, max } = req.query;
    let meta;
    const query = [];
    let skip = 0;
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || config.get('pagination').size;
    skip = (page - 1) * limit;

    if (sortBy) {
      sortBy = { '_id': parseInt(sortBy) } || req.query.sortBy;
    } else {
      sortBy = { '_id': -1 };
    }

    // if (isNewArrival == true) {
    //   sortBy = { '_id': -1 };
    // }

    // if (search) {
    //   query.name = {
    //     $regex: new RegExp(search.toLowerCase().replace(/\s+/g, '\\s+'), 'gi')
    //   };
    // }
    if (search) {
      query.push(
        {
          '$match': {
            '$or': [
              {
                'name': { '$regex': new RegExp(search.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') },
              },
            ]
          }
        },
      )
    }

    // if (max==null) {
    //   // query.price = { $gte: parseInt(min), $lte: parseInt(max) };
    //   query.push(
    //     {
    //       '$match': {
    //         price: { $gte: parseInt(min)}
    //       }
    //     },

    //   )
    // }

    if (min || max) {
      // if (min == undefined) {
      // min = 0;

      query.push(
        {
          '$match': {
            price: { $gte: parseInt(min) ? parseInt(min) : 0, $lte: parseInt(max) ? parseInt(max) : 0 }
          }
        },

      )
    }

    // if (visible) query.visible = true;
    if (visible) {
      query.push(
        {
          '$match': {
            visible: true
          }
        },
      )
    }
    // if (categoryId) query.category = categoryId;
    // if (subCategoryId) query.subCategory = subCategoryId;
    // if (categoryId) {
    //   query.push({
    //     $match: { 'parentInfo.category': { $in: [mongoose.Types.ObjectId(categoryId)] } }
    //   });
    // }
    // if (subCategoryId) {
    //   query.push({
    //     $match: { 'parentInfo.subCategoryId': { $in: [mongoose.Types.ObjectId(subCategoryId)] } }
    //   });
    // }
    // query.isDeleted = {
    //   $ne: true
    // };
    if (isFeatured=='true') {
      query.push({
        $match: {
          isFeatured: true 
        }
      });
    }

    if (isDeleted=='true') {
      query.push({
        $match: {
          isDeleted: { $ne: false }
        }
      });
    }else{
      query.push({
        $match: {
          isDeleted: { $ne: true }
        }
      });
    }
    // query.push({
    //   $match: {
    //     isDeleted: { $ne: true }
    //   }
    // });
    // if (isFeatured) query.isFeatured = true;
    

    query.push(
      {
        $lookup: {
          localField: "parentProduct",
          foreignField: "_id",
          from: "parentproducts",
          as: "parentInfo"
        }
      },
      {
        $lookup: {
          localField: "parentInfo.category",
          foreignField: "_id",
          from: "categories",
          as: "categoryInfo"
        }
      },
      
      // {
      //   $lookup: {
      //     localField: "parentInfo.subCategory",
      //     foreignField: "_id",
      //     from: "sub-categories",
      //     as: "sub-categories-Info"
      //   }
      // },
      // { $project : { signedUrl : 1 } },
      { $sort: sortBy },
      { $skip: skip },
      { $limit: limit },
    );
    if (categoryId) {
      query.push({
        $match: { 'parentInfo.category': { $in: [mongoose.Types.ObjectId(categoryId)] } }
      });
    }

    if (subCategoryId) {
      query.push({
        $match: { 'parentInfo.subCategory': { $in: [mongoose.Types.ObjectId(subCategoryId)] } }
      });
    }

    // query.push({
    //   $addField:getImage(ProductModel.image)
    // })
    

    products = await ProductModel.aggregate(query);
    // if (!_.isEmpty(ProductModel.images)) {
      const images = [];
      products.forEach(element => {
        for (const image of element.images) {
          if (!image.url) continue;
          image.url = fileUtil.getSignedUrl(image.url);
          images.push(image);
        }
        return images;
      });
      
      
      
    // }
    const dataToSend = {
      data: products,
      signedUrl:images
    };
    if (page === 1) {
      meta = {
        currentPage: page,
        recordsPerPage: limit,
        // totalRecords: await ProductModel.aggregate(query).count()
        totalRecords: products.length
      };
      meta.totalPages = Math.ceil(meta.totalRecords / meta.recordsPerPage);
      dataToSend.meta = meta;
    }

    res.send(dataToSend);
  }

  async remove(req, res, next) {
    const { ProductId } = req.params;
    let product;
    try {
      product = await ProductModel.findById(ProductId);
    } catch (err) {
      return next(err);
    }
    if (!product) {
      const e = new Error('Product Does Not exists');
      e.statusCode = 400;
      return next(e);
    }
    try {
      await ProductModel.updateOne(
        { _id: ProductId },
        {
          $set: {
            isDeleted: true
          }
        }
      );
    } catch (err) {
      return next(err);
    }
    res.json({ message: 'Product Deleted' });
  }

  async getImage(images){
    if (!_.isEmpty(ProductModel.images)) {
      const images = [];
      for (const image of ProductModel.images) {
        if (!image.url) continue;
        image.url = fileUtil.getSignedUrl(image.url);
        images.push(image);
      }
      return images;
    }
  }
}

module.exports = new ProductController(productFacade);
