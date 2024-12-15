require("dotenv").config();
import mongoose, {Document, Model, Schema} from "mongoose";

export interface IOrder extends Document{
    customerId: string;
    cart: {product: object; qty: number;}[];
    total: number;
    billPayment: number;
    bill: string;
    createdAt: Date;
};

export const OrderSchema = new Schema<IOrder>({
    customerId:{type: String },
    cart: {type: [Object]},
    total:{type: Number},
    billPayment:{type: Number, default: 0},
    bill:{type: String,}
},{timestamps: true});

// Create the model
const OrderModel: Model<IOrder> = mongoose.model<IOrder>("Order", OrderSchema);

export default OrderModel;