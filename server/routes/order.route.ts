import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { addOrder, createCart, deleteCart, deleteOrder, editCart, getOrder } from "../controllers/order.controller";
import { PDFgenerator } from "../utils/puppeteer";
const router = express.Router();

router.post("/fill-cart/:id", createCart);
router.put("/edit-cart/:id/:index",  editCart);
router.delete("/delete-cart/:id/:index",  deleteCart);
router.post("/add-order/:id",  addOrder);
router.delete('/delete-order/:id',  deleteOrder)
router.get("/get-order/:id",getOrder);


export default router