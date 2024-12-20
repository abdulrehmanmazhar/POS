"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSales = void 0;
// @ts-nocheck
require("dotenv").config();
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
exports.getSales = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { type, dateRange, startDate, endDate } = req.body;
        const transactions = await (async function (type, dateRange, startDate, endDate) {
            console.log("Function invoked with parameters:", { type, dateRange, startDate, endDate });
            let filter = { type: type };
            const now = new Date();
            if (dateRange === 'today') {
                const startOfDay = new Date(now.setHours(0, 0, 0, 0));
                const endOfDay = new Date(now.setHours(23, 59, 59, 999));
                filter.createdAt = { $gte: startOfDay, $lte: endOfDay };
            }
            else if (dateRange === 'month') {
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
                filter.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
            }
            else if (dateRange === 'year') {
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
                filter.createdAt = { $gte: startOfYear, $lte: endOfYear };
            }
            else if (dateRange === 'custom') {
                if (startDate && endDate) {
                    filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
                }
                else {
                    throw new Error('Custom range requires both startDate and endDate');
                }
            }
            console.log("Filter created:", filter);
            const result = await transaction_model_1.default.find(filter);
            console.log("Transactions fetched:", result);
            return result;
        })(type, dateRange, startDate, endDate);
        res.status(200).json({ success: true, transactions });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
