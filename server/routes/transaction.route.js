"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transaction_controller_1 = require("../controllers/transaction.controller");
const router = express_1.default.Router();
router.post('/create-transaction', transaction_controller_1.createTransaction);
router.delete('/delete-transaction/:id', transaction_controller_1.deleteTransaction);
router.get('/get-transactions', transaction_controller_1.getTransactions);
router.get('/get-today-transactions', transaction_controller_1.getTodayTransactions);
exports.default = router;
