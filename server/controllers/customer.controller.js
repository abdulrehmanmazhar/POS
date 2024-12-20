"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnUdhar = exports.getCustomerById = exports.deleteCustomer = exports.getCustomer = exports.editCustomer = exports.addCustomer = void 0;
// @ts-nocheck
require("dotenv")
    .config();
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const customer_model_1 = __importDefault(require("../models/customer.model"));
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
exports.addCustomer = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { name, address, contact } = req.body;
        const doesExist = await customer_model_1.default.findOne({ contact });
        if (doesExist) {
            return next(new ErrorHandler_1.default("Account already exists for this contact", 400));
        }
        const customer = await customer_model_1.default.create({ name, address, contact });
        res.status(200).json({
            success: true,
            customer
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.editCustomer = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const doesExist = await customer_model_1.default.findById(id);
        if (!doesExist) {
            return next(new ErrorHandler_1.default("Customer with this id not found", 400));
        }
        if (data) {
            const customer = await customer_model_1.default.findByIdAndUpdate(id, { $set: data }, { new: true });
            res.status(200).json({
                success: true,
                customer
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getCustomer = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const customers = await customer_model_1.default.find().sort({ createdAt: -1 });
        if (!customers) {
            return next(new ErrorHandler_1.default("No customers found", 404));
        }
        res.status(200).json({
            success: true,
            customers
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.deleteCustomer = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const customer = await customer_model_1.default.findById(id);
        if (!customer) {
            return next(new ErrorHandler_1.default("Customer not found with this id", 400));
        }
        await customer_model_1.default.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Deleted the customer successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getCustomerById = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params; // Extract the id from params
        // Find the customer by ID
        const customer = await customer_model_1.default.findById(id);
        if (!customer) {
            return next(new ErrorHandler_1.default("Customer not found", 404));
        }
        res.status(200).json({
            success: true,
            customer,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.returnUdhar = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params; // Extract the id from params
        const { returnUdhar } = req.body;
        // Find the customer by ID
        const customer = await customer_model_1.default.findById(id);
        if (!customer) {
            return next(new ErrorHandler_1.default("Customer not found", 404));
        }
        if (returnUdhar > customer.udhar) {
            return next(new ErrorHandler_1.default("Cannot pay more than udhar amount", 400));
        }
        const type = "sale";
        const transaction = await transaction_model_1.default.create({ type, amount: returnUdhar, description: `${customer.name}-${customer.address} paid from his udhar ${customer.udhar}` });
        if (!transaction) {
            return next(new ErrorHandler_1.default("Couldn't make transaction", 500));
        }
        customer.udhar = customer.udhar - returnUdhar;
        await customer.save();
        res.status(200).json({
            success: true,
            message: `Udhar is now ${customer.udhar} PKR`
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
