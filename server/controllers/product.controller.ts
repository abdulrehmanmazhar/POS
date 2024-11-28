require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";

import ProductModel from "../models/product.model";

export const addProduct = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const { name, category, price, stockQty } = req.body;
        let inStock = false;
        if(name && category && price && stockQty){   
            const product = await ProductModel.findOne({name, category});
            
            if(product){
                return next(new ErrorHandler(`Product already exists`,400))
            }
            if(stockQty>0){
                inStock = true
            }
            const createdProduct = await ProductModel.create({name, category, price, stockQty, inStock})
            res.status(200).json({
                success: true,
                createdProduct
            })
        }else{
            return next(new ErrorHandler("Something is missing from arguments",400))
        }
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
        
    }
})

export const editProduct = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const { name, category, price, stockQty } = req.body;
        const {id} = req.params;
        let inStock = false;

        const targetProduct = await ProductModel.findById(id);
        if(!targetProduct){
            return next(new ErrorHandler("Target product not found",400))
        }

        const sameProduct = await ProductModel.findOne({name, category, price, stockQty})

        if(sameProduct){
            return next(new ErrorHandler("Same product found so you cannot proceed",400));
        }
        if(stockQty>0){
            inStock = true
        }

        const data = { name, category, price, stockQty, inStock };
        const editedOne = await ProductModel.findByIdAndUpdate(id,{$set:data},{new: true})

        res.status(200).json({
            success:true,
            editedOne
        })
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
        
    }
})

export const getProducts = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const products = await ProductModel.find().sort({createdAt:-1})

        if(!products){
            return next(new ErrorHandler("No products found",404))
        }
        res.status(200).json({
            success: true,
            products
        })
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
        
    }
})

export const deleteProduct = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const {id} = req.params;

    const product = await ProductModel.findById(id);

    if(!product){
        return next(new ErrorHandler("Product not found with this id", 400 ))
    }

    await ProductModel.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message:"Deleted the product successfully"
    })
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
        
    }
})