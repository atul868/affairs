const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator/check');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const controller = require('./controller');
const validator = require('../../utils/validator');
const authenticate = require('../../policies/authenticate');
const hasAccess = require('../../policies/hasAccess');

const dir = path.resolve('./uploads');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    }

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
        },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage
});

router.route('/')
    .post(
        authenticate,
        hasAccess(['category.create']),
        [
            body('name')
                .exists()
                .isString()
                .withMessage('Invalid Name'),
            body('image')
                .optional()
                .isString()
                .withMessage('Invalid Image'),
            body('description')
                .optional()
                .isString()
                .withMessage('Invalid Description'),
            body('products')
                .exists()
                .isArray()
                .withMessage('Invalid Products'),
            validator
        ],
        (...args) => controller.create(...args)
    )
    .get(
        [
            query('limit')
                .optional()
                .isNumeric()
                .withMessage('Invalid Limit'),
            query('page')
                .optional()
                .isNumeric()
                .withMessage('Invalid Page'),
            query('name')
                .optional()
                .isString()
                .withMessage('Invalid Name'),
               validator 
        ],
        (...args) => controller.select(...args)
    );

router.route('/:CollectionId')
    .put(
        authenticate,
        hasAccess(['category.update']),
        [
            param('CollectionId')
                .exists()
                .isString()
                .withMessage('Invalid CollectionId'),
            body('name')
                .optional()
                .isString()
                .withMessage('Invalid Name'),
            body('image')
                .optional()
                .isString()
                .withMessage('Invalid Image'),
            body('description')
                .optional()
                .isString()
                .withMessage('Invalid Description'),
            body('products')
                .optional()
                .isArray()
                .withMessage('Invalid Products'),
            validator
        ],
        (...args) => controller.edit(...args)
    )
    .get(
        [
            param('CollectionId')
                .exists()
                .isString()
                .withMessage('Invalid CollectionId'),
            validator
        ],
        (...args) => controller.getCollection(...args)
    ).
    delete(
        authenticate,
        hasAccess(['category.delete']),
        [
            param('CollectionId')
                .exists()
                .isString()
                .withMessage('Invalid CollectionId'),
            validator
        ],
        (...args) => controller.delete(...args)
    );

router.route('/:CollectionId/products')
    .post(
        authenticate,
        hasAccess(['category.addProduct']),
        [
            param('CollectionId')
                .exists()
                .isString()
                .withMessage('Invalid CollectionId'),
            body('productId')
                .exists()
                .isString()
                .withMessage('Invalid ProductId'),
            validator

        ],
        (...args) => controller.addProduct(...args)
        )
    .delete(
        authenticate,
        hasAccess(['category.removeProduct']),
        [
            param('CollectionId')
                .exists()
                .isString()
                .withMessage('Invalid CollectionId'),
            body('productId')
                .exists()
                .isString()
                .withMessage('Invalid ProductId'),
            validator

        ],
        (...args) => controller.removeProduct(...args)
    )

router.route('/:CollectionId/image')
    .post(
        authenticate,
        hasAccess(['category.update']),
        upload.single('image'),
        [
            param('CollectionId')
                .exists()
                .isString()
                .withMessage('Invalid CollectionId'),
            validator
        ],
        (...args) => controller.uploadImage(...args)
    )
    .delete(
        authenticate,
        hasAccess(['category.update']),
        [
            param('CollectionId')
                .exists()
                .isString()
                .withMessage('Invalid CollectionId'),
            validator
        ],
        (...args) => controller.deleteImage(...args)
    )

module.exports = router;