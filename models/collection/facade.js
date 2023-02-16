const Facade = require('../../lib/facade');
const collectionSchema = require('./schema');
const productFacade = require('../product/facade');
class collectionFacade extends Facade {

    async addProduct(collectionId, productId) {
        const collection = await this.findById(collectionId);
        if (!collection) {
            const e = new Error('Collection not found');
            e.statusCode = 404;
            throw e;
        }
        collection.products.push(productId);
        return await collection.save();
    }

    async removeProduct(collectionId, productId) {
        const collection = await this.findById(collectionId);
        if (!collection) {
            const e = new Error('Collection not found');
            e.statusCode = 404;
            throw e;
        }
        collection.products = collection.products.filter(id => id !== productId);
        return await collection.save();
    }

    async getProducts(collectionId) {
        const collection = await this.findById(collectionId);
        if (!collection) {
            const e = new Error('Collection not found');
            e.statusCode = 404;
            throw e;
        }
        const products = await productFacade.getProducts(collection.products);
        return products;
    }

}

module.exports = new  collectionFacade(collectionSchema);
