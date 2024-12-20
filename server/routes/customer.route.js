"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customer_controller_1 = require("../controllers/customer.controller");
const router = express_1.default.Router();
router.post('/add-customer', customer_controller_1.addCustomer);
router.put('/edit-customer/:id', customer_controller_1.editCustomer);
router.get('/get-customers', customer_controller_1.getCustomer);
router.get('/get-customer/:id', customer_controller_1.getCustomerById);
router.delete('/delete-customer/:id', customer_controller_1.deleteCustomer);
router.put(`/returnUdhar/:id`, customer_controller_1.returnUdhar);
exports.default = router;
