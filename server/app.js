"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv").config();
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_1 = require("./middleware/error");
const user_route_1 = __importDefault(require("./routes/user.route"));
const customer_route_1 = __importDefault(require("./routes/customer.route"));
const product_route_1 = __importDefault(require("./routes/product.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const transaction_route_1 = __importDefault(require("./routes/transaction.route"));
const analytics_route_1 = __importDefault(require("./routes/analytics.route"));
const puppeteer_1 = require("./utils/puppeteer");
const path_1 = __importDefault(require("path"));
// body parser
exports.app.use(express_1.default.json({ limit: "50kb" }));
// cookie parser
exports.app.use((0, cookie_parser_1.default)());
// cors
exports.app.use((0, cors_1.default)({
    // origin: process.env.NODE_ENV === 'production' ? process.env.ORIGINS : '*',
    origin: ['http://localhost:5173'],
    // origin:['http://localhost:8000'],
    credentials: true
}));
exports.app.use("/api/v1", user_route_1.default);
exports.app.use("/api/v1", customer_route_1.default);
exports.app.use("/api/v1", product_route_1.default);
exports.app.use("/api/v1", order_route_1.default);
exports.app.use("/api/v1", transaction_route_1.default);
exports.app.use("/api/v1", analytics_route_1.default);
// Route to serve specific bill files
exports.app.get('/api/v1/bills/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path_1.default.join(__dirname, 'public/bills', filename);
    // Serve the file
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(404).send('File not found');
        }
    });
});
exports.app.get("/test", puppeteer_1.PDFgenerator);
// unknown route 
exports.app.all("*", (req, res, next) => {
    const err = new Error(`Can't find ${req.originalUrl} on this server`);
    err.statusCode = 404;
    next(err);
});
exports.app.use(error_1.errorMiddleware);
