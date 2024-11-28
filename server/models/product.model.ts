require("dotenv").config();
import mongoose, {Document, Model, Schema} from "mongoose";

export interface IProduct extends Document{
    name: string;
    category: string;
    price: number;
    stockQty: number;
    inStock: boolean;
};

export const ProductSchema = new Schema<IProduct>({
    name:{type: String, required:true},
    category: {type: String, required:true},
    price:{type: Number, required:true},
    stockQty:{type: Number, required:true},
    inStock:{type: Boolean, required:true},
},{timestamps: true});

const ProductModel: Model<IProduct> = mongoose.model<IProduct>("Product", ProductSchema);

export default ProductModel;