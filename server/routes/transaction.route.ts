import express  from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createTransaction, deleteTransaction, getTodayTransactions, getTransactions } from "../controllers/transaction.controller";
const router = express.Router();

router.post('/create-transaction',  createTransaction)
router.delete('/delete-transaction/:id',  deleteTransaction)
router.get('/get-transactions', getTransactions)
router.get('/get-today-transactions', getTodayTransactions)


export default router
