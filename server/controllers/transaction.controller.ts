require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";

import TransactionModel from "../models/transaction.model";

export const createTransaction = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const {type, amount, description} = req.body;
        if(type && amount && description){
            const transaction = await TransactionModel.create({type, amount, description});
            if (!transaction){
                return next(new ErrorHandler("Error happend while creating transaction",500))
            }
            res.status(200).json({
                success: true,
                transaction
            })
        }
        return next(new ErrorHandler("Some argument is missing",400))
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
        
    }
})

export const deleteTransaction = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const {id} = req.params;
        const target = await TransactionModel.findById(id);
        if(!target){
            return next(new ErrorHandler("Targetted transaction not found",400))
        }
        let result = await TransactionModel.findByIdAndDelete(id);

        if(result){
            return next(new ErrorHandler("Error deleting transaction",500))

        }
            res.status(200).json({
                success: true,
                message: 'Transaction removed successfully'
            })
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
        
    }
})

export const getTransactions = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const transactions = await TransactionModel.find().sort({createdAt:-1})

        if(!transactions){
            return next(new ErrorHandler("No transactions found",404))
        }
        res.status(200).json({
            success: true,
            transactions
        })
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
        
    }
})