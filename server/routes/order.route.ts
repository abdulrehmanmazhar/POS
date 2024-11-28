import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { addOrder, createCart, deleteCart, deleteOrder, editCart } from "../controllers/order.controller";
const router = express.Router();

router.post("/fill-cart/:id", isAuthenticated, createCart);
router.put("/edit-cart/:id/:index", isAuthenticated, editCart);
router.delete("/delete-cart/:id/:index", isAuthenticated, deleteCart);
router.post("/add-order/:id", isAuthenticated, addOrder);
router.delete('/delete-order/:id', isAuthenticated, deleteOrder)


export default router