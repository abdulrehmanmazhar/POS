import express  from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getTransactions } from "../controllers/transaction.controller";
import { getSales } from "../controllers/analytics.controller";
const router = express.Router();
router.post('/get-sales', getSales)

export default router