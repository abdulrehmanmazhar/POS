"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restockProduct = exports.deleteProduct = exports.getProducts = exports.editProduct = exports.addProduct = void 0;
// @ts-nocheck
require("dotenv").config();
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const product_model_1 = __importDefault(require("../models/product.model"));
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
exports.addProduct = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { name, category, price, stockQty, totalBill, discount } = req.body;
        let inStock = false;
        // console.log(name, category, price, stockQty, totalBill, discount)
        if (name && category && price && stockQty && totalBill) {
            const product = await product_model_1.default.findOne({ name, category });
            if (product) {
                return next(new ErrorHandler_1.default(`Product already exists`, 400));
            }
            if (stockQty > 0) {
                inStock = true;
            }
            let purchasePrice = totalBill / stockQty;
            let history = [];
            let historyIndices = {
                qty: stockQty,
                totalBill: totalBill,
                purchasePrice,
                date: new Date(Date.now())
            };
            history.push(historyIndices);
            const createdProduct = await product_model_1.default.create({ name, category, price, stockQty, inStock, purchasePrice, discount, history });
            await transaction_model_1.default.create({ type: "investment", amount: totalBill, description: `added new product ${name}(${category})` });
            res.status(200).json({
                success: true,
                createdProduct
            });
        }
        else {
            return next(new ErrorHandler_1.default("Something is missing from arguments", 400));
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.editProduct = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { name, category, price, stockQty } = req.body;
        const { id } = req.params;
        let inStock = false;
        const targetProduct = await product_model_1.default.findById(id);
        if (!targetProduct) {
            return next(new ErrorHandler_1.default("Target product not found", 400));
        }
        const sameProduct = await product_model_1.default.findOne({ name, category, price, stockQty });
        if (sameProduct) {
            return next(new ErrorHandler_1.default("Same product found so you cannot proceed", 400));
        }
        if (stockQty > 0) {
            inStock = true;
        }
        const data = { name, category, price, stockQty, inStock };
        const editedOne = await product_model_1.default.findByIdAndUpdate(id, { $set: data }, { new: true });
        res.status(200).json({
            success: true,
            editedOne
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getProducts = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const products = await product_model_1.default.find().sort({ createdAt: -1 });
        if (!products) {
            return next(new ErrorHandler_1.default("No products found", 404));
        }
        res.status(200).json({
            success: true,
            products
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.deleteProduct = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await product_model_1.default.findById(id);
        if (!product) {
            return next(new ErrorHandler_1.default("Product not found with this id", 400));
        }
        await product_model_1.default.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Deleted the product successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.restockProduct = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { price, stockQty, discount, totalBill } = req.body;
        const { id } = req.params;
        let inStock = false;
        if (!(price && stockQty && totalBill)) {
            return next(new ErrorHandler_1.default("something is missing", 400));
        }
        const targetProduct = await product_model_1.default.findById(id);
        if (!targetProduct) {
            return next(new ErrorHandler_1.default("Target product not found", 400));
        }
        if (stockQty > 0) {
            inStock = true;
        }
        let purchasePrice = totalBill / stockQty;
        let history = targetProduct.history;
        let historyIndices = {
            qty: stockQty,
            totalBill: totalBill,
            purchasePrice,
            date: new Date(Date.now())
        };
        history.push(historyIndices);
        const data = { price, stockQty: targetProduct.stockQty + stockQty, discount, totalBill, purchasePrice, history };
        const editedOne = await product_model_1.default.findByIdAndUpdate(id, { $set: data }, { new: true });
        await transaction_model_1.default.create({ type: "investment", amount: totalBill, description: `restocked the product ${targetProduct.name}(${targetProduct.category})` });
        res.status(200).json({
            success: true,
            editedOne
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
