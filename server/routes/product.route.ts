import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { addProduct, deleteProduct, editProduct, getProducts } from "../controllers/product.controller";
const router = express.Router();

router.post("/add-product", addProduct);
router.put("/edit-product/:id", editProduct);
router.get("/get-products", getProducts);
router.delete("/delete-product/:id", deleteProduct);



export default router