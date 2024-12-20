"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const router = express_1.default.Router();
router.post("/add-product", product_controller_1.addProduct);
router.put("/restock-product/:id", product_controller_1.restockProduct);
router.put("/edit-product/:id", product_controller_1.editProduct);
router.get("/get-products", product_controller_1.getProducts);
router.delete("/delete-product/:id", product_controller_1.deleteProduct);
exports.default = router;
