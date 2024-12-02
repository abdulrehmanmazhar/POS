require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import customerRouter from "./routes/customer.route"
import productRouter from "./routes/product.route"
import orderRouter from "./routes/order.route"
import transactionRouter from "./routes/transaction.route"
import { PDFgenerator } from "./utils/puppeteer";




// body parser

app.use(express.json({limit: "50kb"}));

// cookie parser

app.use(cookieParser());

// cors

app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.ORIGINS : '*',
    // origin:['http://localhost:3000'],
    credentials: true
}))




app.use("/api/v1",userRouter);
app.use("/api/v1",customerRouter);
app.use("/api/v1",productRouter);
app.use("/api/v1",orderRouter);
app.use("/api/v1",transactionRouter);








app.get("/test", PDFgenerator)

// unknown route 

app.all("*", (req : Request, res : Response, next : NextFunction)=>{
    const err = new Error(`Can't find ${req.originalUrl} on this server`) as any;
    err.statusCode = 404;
    next(err);
})

app.use(errorMiddleware);