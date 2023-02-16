const _ = require('lodash');
const config = require('config');
const CollectionModel = require('./schema');
const collectionFacade = require('./facade');


class CollectionController {

    async create(req, res, next) {
        let collection;

        const { name, image, description, products } = req.body;

        try {
            collection = await CollectionModel.findOne({ name });
        }
        catch (err) {
            return next(err);
        }

        if (collection) {
            const e = new Error('Collection already exists with name ' + name);
            e.statusCode = 400;
            return next(e);
        }

        try {
            collection = await collectionFacade.create({
                name,
                image,
                description,
                products
            });
        } catch (err) {
            return next(err);
        }
        res.status(201).json(collection);
    }

    async select(req, res, next) {
        let collections;
        let { limit, page, name } = req.query;
        let meta = {};
        let skip =0;
        page = parseInt(page, 10) || 1;
        limit = parseInt(limit, 10) || config.get('pagination').size;
        skip = (page - 1) * limit;
        let query = {};
        if (name) {
            //search by name
            query.name = {
                $regex: new RegExp(name.toLowerCase().replace(/\s+/g, '\\s+'), 'gi')
            }
        }
        try {
            collections = await CollectionModel.find(query)
            .skip(skip)
            .limit(limit);
        } catch (err) {
            return next(err);
        }
        const dataToSend = {
            data: collections,
        }
        res.status(200).json(dataToSend);
    }
    async edit(req, res, next) {
        let collection;
        const { CollectionId } = req.params;
        const {  products } = req.body;
        try {
            collection = await CollectionModel.findById(CollectionId);
        }
        catch (err) {
            return next(err);
        }
        const d = {
            name:null,
            image:null,
            description:null,
            products:null
        }
        if (!collection) {
            const e = new Error('Collection not found');
            e.statusCode = 404;
            return next(e);
        }
        for (const key in d) {
            d[key] = req.body[key];
          }
      
        // validate products
        if (products) {
            const productIds = products.map(product => product._id);
            const uniqueProductIds = _.uniq(productIds);
            if (productIds.length !== uniqueProductIds.length) {
                const e = new Error('Duplicate products found : Please remove duplicate products');
                e.statusCode = 400;
                return next(e);
            }
        }
        const obj = _.pickBy(d, h => !_.isUndefined(h));
        try {
            collection = await CollectionModel.update({_id: CollectionId}, obj);
        } catch (err) {
            return next(err);
        }
        res.status(200).json({
            message: 'Collection updated'
        });
    }

    async delete(req, res, next) {
        let collection;
        const { CollectionId } = req.params;
        try {
            collection = await CollectionModel.findById(CollectionId);
        }
        catch (err) {
            return next(err);
        }
        if (!collection) {
            const e = new Error('Collection not found');
            e.statusCode = 404;
            return next(e);
        }
        try {
            collection = await CollectionModel.deleteOne({ _id: CollectionId });
        } catch (err) {
            return next(err);
        }
        res.status(200).json({
            message: 'Collection deleted'
        });
    }

    async getCollection(req, res, next) {
        let collection;
        const { CollectionId } = req.params;
        try {
            collection = await CollectionModel.findById(CollectionId);
        }
        catch (err) {
            return next(err);
        }
        if (!collection) {
            const e = new Error('Collection not found');
            e.statusCode = 404;
            return next(e);
        }
        res.status(200).json(collection);
    }

    async uploadImage(req, res, next) {
        let collection;
        const { CollectionId } = req.params;
        const { image } = req.body;
        try {
            collection = await CollectionModel.findById(CollectionId);
        }
        catch (err) {
            return next(err);
        }
        if (!collection) {
            const e = new Error('Collection not found');
            e.statusCode = 404;
            return next(e);
        }
        try {
            collection = await collectionFacade.update({
                _id: CollectionId
            }, {
                image
            });
        } catch (err) {
            return next(err);
        }
        res.status(200).json({
            message: 'Image uploaded'
        });
    }

    async deleteImage(req, res, next) {
        let collection;
        const { CollectionId } = req.params;
        try {
            collection = await CollectionModel.findById(CollectionId);
        }
        catch (err) {
            return next(err);
        }
        if (!collection) {
            const e = new Error('Collection not found');
            e.statusCode = 404;
            return next(e);
        }
        try {
            collection = await collectionFacade.update({
                _id: CollectionId
            }, {
                image: null
            });
        } catch (err) {
            return next(err);
        }
        res.status(200).json({
            message: 'Image deleted'
        });
    }

    async addProduct(req, res, next) {
        let collection;
        const { CollectionId } = req.params;
        const { productId } = req.body;
        try {
            collection = await CollectionModel.findById(CollectionId);
        }
        catch (err) {
            return next(err);
        }
        if (!collection) {
            const e = new Error('Collection not found');
            e.statusCode = 404;
            return next(e);
        }
        try {
            collection = await collectionFacade.addProduct(CollectionId, productId);
        } catch (err) {
            return next(err);
        }
        res.status(200).json({
            message: 'Product added'
        });
    }

    async removeProduct(req, res, next) {
        let collection;
        const { CollectionId } = req.params;
        const { productId } = req.body;
        try {
            collection = await CollectionModel.findById(CollectionId);
        }
        catch (err) {
            return next(err);
        }
        if (!collection) {
            const e = new Error('Collection not found');
            e.statusCode = 404;
            return next(e);
        }
        try {
            collection = await collectionFacade.removeProduct(CollectionId, productId);
        } catch (err) {
            return next(err);
        }
        res.status(200).json({
            message: 'Product removed'
        });
    }

    

}

module.exports = new CollectionController(collectionFacade);