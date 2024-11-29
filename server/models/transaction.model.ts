require("dotenv").config();
import mongoose, {Document, Model, Schema} from "mongoose";

export interface ITransaction extends Document{
    type: string;
    amount: number;
    description: string;
    orderId: string;
};
export const TransactionSchema = new Schema<ITransaction>({
    type:{type: String, required: true},
    amount:{type: Number, required: true},
    description:{type: String, required: true},
    orderId: {type: String},
},{timestamps: true});

const TransactionModel: Model<ITransaction> = mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default TransactionModel;