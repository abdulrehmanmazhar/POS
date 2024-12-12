import express  from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { addCustomer, deleteCustomer, editCustomer, getCustomer } from "../controllers/customer.controller";
const router = express.Router();

router.post('/add-customer', addCustomer)
router.put('/edit-customer/:id', editCustomer)
router.get('/get-customers', getCustomer)
router.delete('/delete-customer/:id',deleteCustomer)



export default router