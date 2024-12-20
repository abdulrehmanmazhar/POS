"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodayTransactions = exports.getTransactions = exports.deleteTransaction = exports.createTransaction = void 0;
// @ts-nocheck
require("dotenv").config();
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
exports.createTransaction = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { type, amount, description, orderId } = req.body;
        if (type && amount && description) {
            let transaction;
            if (type === "sale") {
                transaction = await transaction_model_1.default.create({ type, amount, description, orderId });
            }
            if (type === "expense") {
                transaction = await transaction_model_1.default.create({ type, amount, description });
            }
            if (!transaction) {
                return next(new ErrorHandler_1.default("Error happend while creating transaction", 500));
            }
            res.status(200).json({
                success: true,
                transaction
            });
        }
        return next(new ErrorHandler_1.default("Some argument is missing", 400));
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.deleteTransaction = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const target = await transaction_model_1.default.findById(id);
        if (!target) {
            return next(new ErrorHandler_1.default("Targetted transaction not found", 400));
        }
        let result = await transaction_model_1.default.findByIdAndDelete(id);
        // if(!result){
        //     return next(new ErrorHandler("Error deleting transaction",500))
        // }
        res.status(200).json({
            success: true,
            message: 'Transaction removed successfully'
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getTransactions = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const transactions = await transaction_model_1.default.find().sort({ createdAt: -1 });
        if (!transactions) {
            return next(new ErrorHandler_1.default("No transactions found", 404));
        }
        res.status(200).json({
            success: true,
            transactions
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getTodayTransactions = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        // Get the start and end of today in ISO format
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); // Start of the day
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); // End of the day
        const transactions = await transaction_model_1.default.find({
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            type: "expense"
        }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            transactions
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
