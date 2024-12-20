"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrders = exports.getOrder = exports.deleteOrder = exports.addOrder = exports.deleteCart = exports.editCart = exports.createCart = void 0;
// @ts-nocheck
require("dotenv").config();
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const product_model_1 = __importDefault(require("../models/product.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
const customer_model_1 = __importDefault(require("../models/customer.model"));
const calculateBill_1 = __importDefault(require("../utils/calculateBill"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const invoiceHTML_1 = require("../PDFtemplates/invoiceHTML");
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
exports.createCart = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { productId, qty } = req.body;
        const { id: customerId } = req.params;
        const item = { "product": {}, qty: 0 };
        const customer = await customer_model_1.default.findById(customerId);
        if (!customer) {
            return next(new ErrorHandler_1.default("Customer against this order isn't found", 400));
        }
        const product = await product_model_1.default.findById(productId);
        if (!product) {
            return next(new ErrorHandler_1.default("Product corresponding to this ID is not found", 400));
        }
        if (!product.inStock) {
            return next(new ErrorHandler_1.default("Product out of stock", 400));
        }
        if (qty > product.stockQty) {
            return next(new ErrorHandler_1.default("Order should not exceed the stock limit", 400));
        }
        const unDoneOrder = await order_model_1.default.findOne({ customerId, bill: { $exists: false } });
        const stockMinus = product.stockQty - qty;
        product.stockQty = stockMinus;
        if (stockMinus === 0) {
            product.inStock = false;
        }
        await product.save();
        item.product = product;
        item.qty = qty;
        let order = {};
        if (unDoneOrder) {
            unDoneOrder.cart.push(item);
            order = await unDoneOrder.save();
        }
        else {
            order = await order_model_1.default.create({ customerId, cart: [item] });
        }
        res.status(200).json({
            success: true,
            message: `${qty} pieces of ${product.name} added in cart successfully`,
            order
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.editCart = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id: orderId } = req.params;
        const { index } = req.params;
        const { productId, qty } = req.body;
        const item = { "product": {}, qty };
        const order = await order_model_1.default.findById(orderId);
        if (!order) {
            return next(new ErrorHandler_1.default("Order against this orderId isn't found", 400));
        }
        const product = await product_model_1.default.findById(productId);
        if (!product) {
            return next(new ErrorHandler_1.default("Product corresponding to this ID is not found", 400));
        }
        if (!product.inStock) {
            return next(new ErrorHandler_1.default("Product out of stock", 400));
        }
        item.product = product;
        if (qty > product.stockQty) {
            return next(new ErrorHandler_1.default("Order should not exceed the stock limit", 400));
        }
        const targetOrder = await order_model_1.default.findById(orderId);
        const targetOrderCartArray = targetOrder.cart;
        if (targetOrder && targetOrder.cart && targetOrder.cart[index]) {
            const oldProductStock = targetOrderCartArray[index].product.stockQty;
            const oldproduct = await product_model_1.default.findById(targetOrderCartArray[index].product._id);
            if (!oldproduct) {
                return next(new ErrorHandler_1.default("Old product not found to return its stock", 400));
            }
            oldproduct.stockQty += oldProductStock;
            if (oldproduct.stockQty > 0) {
                oldproduct.inStock = true;
            }
            await oldproduct.save();
            targetOrderCartArray[index] = item;
            targetOrder.cart = targetOrderCartArray;
            const stockMinus = product.stockQty - qty;
            product.stockQty = stockMinus;
            if (stockMinus === 0) {
                product.inStock = false;
            }
            await product.save();
            await targetOrder.save();
        }
        else {
            return next(new ErrorHandler_1.default("couldn't find the target cart", 400));
        }
        res.status(200).json({
            success: true,
            message: "changes happened successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.deleteCart = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id: orderId } = req.params;
        const { index } = req.params;
        const order = await order_model_1.default.findById(orderId);
        if (!order) {
            return next(new ErrorHandler_1.default("Order against this orderId isn't found", 400));
        }
        const targetOrder = await order_model_1.default.findById(orderId);
        const targetOrderCartArray = targetOrder.cart;
        if (targetOrder && targetOrder.cart && targetOrder.cart[index]) {
            const oldProductStock = targetOrderCartArray[index].qty;
            const oldproduct = await product_model_1.default.findById(targetOrderCartArray[index].product._id);
            if (!oldproduct) {
                return next(new ErrorHandler_1.default("Old product not found to return its stock", 400));
            }
            oldproduct.stockQty += oldProductStock;
            if (oldproduct.stockQty > 0) {
                oldproduct.inStock = true;
            }
            await oldproduct.save();
            targetOrder.cart.splice(parseInt(index, 10), 1);
            await targetOrder.save();
        }
        else {
            return next(new ErrorHandler_1.default("couldn't find the target cart", 400));
        }
        res.status(200).json({
            success: true,
            message: "deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.addOrder = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id: orderId } = req.params;
        let { billPayment, customerId } = req.body;
        // billPayment = parseInt(billPayment,10);
        const order = await order_model_1.default.findById(orderId);
        if (!order) {
            return next(new ErrorHandler_1.default("Order not found", 400));
        }
        const customer = await customer_model_1.default.findById(customerId);
        if (!customer) {
            return next(new ErrorHandler_1.default("Customer not found", 400));
        }
        if (customer.orders.includes(orderId)) {
            return next(new ErrorHandler_1.default("cannot place a pre-existing order", 400));
        }
        const cart = order.cart;
        let total = (0, calculateBill_1.default)(cart);
        order.billPayment = billPayment;
        order.total = total;
        // const calculateBill = (cart: any) =>{
        //     for(const item of cart){
        //         return total+=item.qty*(item.product.price);
        //     }
        // }
        // for(const item of cart){
        //     total+=item.qty*(item.product.price);
        // }
        // Generate a readable timestamp
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        const invoiceName = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}_invoice.pdf`;
        // Ensure the directory exists
        const billsDir = path_1.default.join(__dirname, "..", "public", "bills");
        if (!fs_1.default.existsSync(billsDir)) {
            fs_1.default.mkdirSync(billsDir, { recursive: true });
        }
        const pdfPath = path_1.default.join(billsDir, invoiceName);
        // Launch Puppeteer
        const browser = await puppeteer_1.default.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        if (billPayment > total) {
            return next(new ErrorHandler_1.default("Payment should not exceed the total bill", 400));
        }
        const udhar = total - billPayment;
        if (udhar > 0) {
            customer.udhar = customer.udhar ? customer.udhar + udhar : 0 + udhar;
        }
        customer.orders.push(orderId);
        const billData = { order, customer, billPayment };
        let generatedMTML;
        try {
            (async () => {
                generatedMTML = await (0, invoiceHTML_1.invoiceHTML)(billData);
            })();
        }
        catch (error) {
            return next(new ErrorHandler_1.default("Error generating bill HTML", 500));
        }
        try {
            const page = await browser.newPage();
            await page.setContent(generatedMTML); // Set the HTML content
            await page.pdf({ path: pdfPath, format: "A4" }); // Save PDF to the specified path
            await browser.close();
            console.log(`PDF generated successfully at ${pdfPath}`);
        }
        catch (err) {
            await browser.close();
            next(new ErrorHandler_1.default("Error generating PDF", 500));
        }
        order.bill = invoiceName;
        await customer.save();
        await order.save();
        let transaction;
        if (billPayment > 0) {
            transaction = await transaction_model_1.default.create({ type: "sale", amount: billPayment, description: `${customer.name} ${year}-${month}-${day}`, orderId });
        }
        res.status(200).json({
            success: true,
            message: "Placed order",
            udhar
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.deleteOrder = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id: orderId } = req.params;
        const order = await order_model_1.default.findById(orderId);
        const targetCart = order.cart;
        let customer = await customer_model_1.default.findById(order.customerId);
        if (order) {
            await order_model_1.default.findByIdAndDelete(orderId);
        }
        if (!customer) {
            return next(new ErrorHandler_1.default("Customer not found", 400));
        }
        customer.orders = customer.orders.filter((orderElements) => orderElements !== orderId);
        let refundableAmount = (0, calculateBill_1.default)(targetCart);
        if (refundableAmount < customer.udhar) {
            customer.udhar -= refundableAmount;
        }
        else
            await customer.save();
        const stockReturn = async (cart) => {
            try {
                for (let item of cart) {
                    let product = await product_model_1.default.findById(item.product._id);
                    let qty = item.qty;
                    product.stockQty += qty;
                    if (qty > 0) {
                        product.inStock = true;
                    }
                    ;
                    await product.save();
                }
            }
            catch {
                return next(new ErrorHandler_1.default("Couldn't return stock", 500));
            }
        };
        await stockReturn(targetCart);
        res.status(200).json({
            success: true,
            message: 'Deleted order and returned products'
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getOrder = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id: orderId } = req.params;
        // Find the order by ID
        const order = await order_model_1.default.findById(orderId);
        if (!order) {
            // If the order is not found, return an error
            return next(new ErrorHandler_1.default("Order not found", 404));
        }
        // If order is found, send it in the response
        res.status(200).json({
            success: true,
            order,
        });
    }
    catch (error) {
        // Handle unexpected errors
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getAllOrders = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        // Retrieve all orders from the database
        const orders = await order_model_1.default.find().select("-__v"); // Exclude __v field if unnecessary
        if (!orders || orders.length === 0) {
            // If no orders are found, return an error
            return next(new ErrorHandler_1.default("No orders found", 404));
        }
        // Send the orders along with their creation dates in the response
        res.status(200).json({
            success: true,
            orders: orders.map(order => ({
                ...order.toObject(),
                createdAt: order.createdAt // Ensure the createdAt field is included
            })),
        });
    }
    catch (error) {
        // Handle unexpected errors
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
