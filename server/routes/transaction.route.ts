import express  from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createTransaction, deleteTransaction, getTransactions } from "../controllers/transaction.controller";
const router = express.Router();

router.post('/create-transaction', isAuthenticated, createTransaction)
router.delete('/delete-transaction', isAuthenticated,authorizeRoles("admin"), deleteTransaction)
router.get('/get-transactions', isAuthenticated, getTransactions)

export default router
