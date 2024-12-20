"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const router = express_1.default.Router();
router.post("/fill-cart/:id", order_controller_1.createCart);
router.put("/edit-cart/:id/:index", order_controller_1.editCart);
router.delete("/delete-cart/:id/:index", order_controller_1.deleteCart);
router.post("/add-order/:id", order_controller_1.addOrder);
router.delete('/delete-order/:id', order_controller_1.deleteOrder);
router.get("/get-order/:id", order_controller_1.getOrder);
router.get("/get-orders", order_controller_1.getAllOrders);
exports.default = router;
