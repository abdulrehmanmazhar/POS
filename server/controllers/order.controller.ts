require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ProductModel, { IProduct, ProductSchema } from "../models/product.model";
import OrderModel, { IOrder } from "../models/order.model";
import CustomerModel from "../models/customer.model";
import calculateBill from "../utils/calculateBill";
interface CustomerOrder {
    product: IProduct;
    qty: number;
}

export const createCart = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const { productId, qty} = req.body;
        const {id : customerId} = req.params
        const item = {"product":{}, qty:0};
        const customer = await CustomerModel.findById(customerId);
        if(!customer){
            return next(new ErrorHandler("Customer against this order isn't found",400))
        }
        const product = await ProductModel.findById(productId);
        if(!product){
            return next(new ErrorHandler("Product corresponding to this ID is not found",400));
        }
        if(!product.inStock){
            return next(new ErrorHandler("Product out of stock", 400));
        }
        if(qty> product.stockQty){
            return next(new ErrorHandler("Order should not exceed the stock limit",400))
        }
        const unDoneOrder = await OrderModel.findOne({customerId, bill: { $exists: false }})
        
        
        const stockMinus = product.stockQty-qty;
        product.stockQty = stockMinus;
        if(stockMinus === 0){
            product.inStock = false;
        }
        await product.save();

        item.product = product;
        item.qty = qty;

        let order={}
        if(unDoneOrder){
            unDoneOrder.cart.push(item);
            order = await unDoneOrder.save();
        }else{
            order = await OrderModel.create({customerId, cart:[item]});
        }
        

        res.status(200).json({
            success: true,
            message: `${qty} pieces of ${product.name} added in cart successfully`,
            order
        })

    } catch (error) {
        return next(new ErrorHandler(error.message,500))
        
    }
})

export const editCart = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const {id: orderId} = req.params;
        const{index} = req.params;
        const { productId, qty} = req.body;
        const item = {"product":{}, qty};
        const order = await OrderModel.findById(orderId);
        if(!order){
            return next(new ErrorHandler("Order against this orderId isn't found",400))
        }
        const product = await ProductModel.findById(productId);
        if(!product){
            return next(new ErrorHandler("Product corresponding to this ID is not found",400));
        }
        if(!product.inStock){
            return next(new ErrorHandler("Product out of stock", 400));
        }
        item.product = product
        if(qty> product.stockQty){
            return next(new ErrorHandler("Order should not exceed the stock limit",400))
        }
        const targetOrder = await OrderModel.findById(orderId);
        const targetOrderCartArray = targetOrder.cart;
        if (targetOrder && targetOrder.cart && targetOrder.cart[index]) {
            const oldProductStock = targetOrderCartArray[index].product.stockQty
            const oldproduct = await ProductModel.findById(targetOrderCartArray[index].product._id);
            if(!oldproduct){
                return next(new ErrorHandler("Old product not found to return its stock",400));
            }
            oldproduct.stockQty+=oldProductStock;
            if(oldproduct.stockQty>0){
                oldproduct.inStock = true;
            }
            await oldproduct.save(); 


            targetOrderCartArray[index] = item;
            targetOrder.cart = targetOrderCartArray;
            
            
            const stockMinus = product.stockQty-qty;
            product.stockQty = stockMinus;
            if(stockMinus === 0){
                product.inStock = false;
            }
            await product.save();
            
            await targetOrder.save();
        } else {
            return next(new ErrorHandler("couldn't find the target cart",400));
        }
        res.status(200).json({
            success: true,
            message: "changes happened successfully",
        })
        

    } catch (error) {
        return next(new ErrorHandler(error.message,500))
        
    }
})

export const deleteCart = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const {id: orderId} = req.params;
        const{index} = req.params;
        const order = await OrderModel.findById(orderId);
        if(!order){
            return next(new ErrorHandler("Order against this orderId isn't found",400))
        }
        const targetOrder = await OrderModel.findById(orderId);
        const targetOrderCartArray = targetOrder.cart;

        if (targetOrder && targetOrder.cart && targetOrder.cart[index]) {
            const oldProductStock = targetOrderCartArray[index].qty;
            const oldproduct = await ProductModel.findById(targetOrderCartArray[index].product._id);
            if(!oldproduct){
                return next(new ErrorHandler("Old product not found to return its stock",400));
            }
            oldproduct.stockQty+=oldProductStock;
            if(oldproduct.stockQty>0){
                oldproduct.inStock = true;
            }
            await oldproduct.save(); 


            
            targetOrder.cart.splice(parseInt(index ,10),1);
            
            
            await targetOrder.save();
        } else {
            return next(new ErrorHandler("couldn't find the target cart",400));
        }
        res.status(200).json({
            success: true,
            message: "deleted successfully",
        })
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
        
    }
})
 
export const addOrder = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const {id: orderId} = req.params;
        let {billPayment, customerId} = req.body;
        // billPayment = parseInt(billPayment,10);
        const order = await OrderModel.findById(orderId);
        if(!order){
            return next(new ErrorHandler("Order not found",400));
        }
        const customer = await CustomerModel.findById(customerId);
        if(!customer){
            return next(new ErrorHandler("Customer not found",400));
        }
        const cart:any = order.cart;
        let total = calculateBill(cart);

        // const calculateBill = (cart: any) =>{
        //     for(const item of cart){
        //         return total+=item.qty*(item.product.price);
        //     }
        // }
        
        // for(const item of cart){
        //     total+=item.qty*(item.product.price);
        // }
        order.billPayment = billPayment
        await order.save();


        if(billPayment>total){
            return next(new ErrorHandler("Payment should not exceed the total bill",400))
        }

        const udhar = total-billPayment;
        if(udhar>0){
            customer.udhar = udhar;
        }
        
        customer.orders.push(orderId);
        
        await customer.save();

        res.status(200).json({
            success: true,
            message: "Placed order",
            udhar
        })
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
        
    }
})


export const deleteOrder = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const {id: orderId} = req.params;
        const order = await OrderModel.findById(orderId);
        const targetCart = order.cart;
        let customer = await CustomerModel.findById(order.customerId);
        

        if(order){
            await OrderModel.findByIdAndDelete(orderId);
        }
        if(!customer){
            return next(new ErrorHandler("Customer not found",400));
        }
        customer.orders = customer.orders.filter((orderElements)=>orderElements !== orderId);

        let refundableAmount = calculateBill(targetCart);
        if (refundableAmount<customer.udhar){
            customer.udhar-=refundableAmount;
        }else
        await customer.save();

        const stockReturn = async(cart:any) =>{
            try{
            for (let item of cart){
                let product = await ProductModel.findById(item.product._id);
                let qty = item.qty;
                product.stockQty+= qty;
                if(qty>0){product.inStock= true};
                await product.save(); 
            }
        }catch{
            return next(new ErrorHandler("Couldn't return stock",500))
        }
        }

        await stockReturn(targetCart);
        res.status(200).json({
            success: true,
            message:'Deleted order and returned products'
        })
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
        
    }
})
