import express  from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { addCustomer, deleteCustomer, editCustomer, getCustomer } from "../controllers/customer.controller";
const router = express.Router();

router.post('/add-customer',isAuthenticated, addCustomer)
router.put('/edit-customer/:id',isAuthenticated, editCustomer)
router.get('/get-customers',isAuthenticated, getCustomer)
router.delete('/delete-customer/:id',isAuthenticated, deleteCustomer)



export default router