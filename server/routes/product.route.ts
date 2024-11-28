import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { addProduct, deleteProduct, editProduct, getProducts } from "../controllers/product.controller";
const router = express.Router();

router.post("/add-product",isAuthenticated, addProduct);
router.put("/edit-product/:id",isAuthenticated, editProduct);
router.get("/get-products",isAuthenticated, getProducts);
router.delete("/delete-product/:id",isAuthenticated, deleteProduct);



export default router