import express  from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { addCustomer, deleteCustomer, editCustomer, getCustomer, getCustomerById, returnUdhar } from "../controllers/customer.controller";
const router = express.Router();

router.post('/add-customer', addCustomer)
router.put('/edit-customer/:id', editCustomer)
router.get('/get-customers', getCustomer)
router.get('/get-customer/:id', getCustomerById)
router.delete('/delete-customer/:id',deleteCustomer)
router.put(`/returnUdhar/:id`, returnUdhar)


export default router