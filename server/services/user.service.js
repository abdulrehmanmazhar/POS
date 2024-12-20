"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = exports.getAllUsers = exports.getUserById = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const getUserById = async (id, res) => {
    const user = await user_model_1.default.findById(id);
    if (user) {
        res.status(201).json({
            success: true,
            user
        });
    }
};
exports.getUserById = getUserById;
const getAllUsers = async (res) => {
    const users = await user_model_1.default.find().sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        users,
    });
};
exports.getAllUsers = getAllUsers;
const updateUserRole = async (res, id, role) => {
    const user = await user_model_1.default.findByIdAndUpdate(id, { role }, { new: true });
    res.status(201).json({
        success: true,
        user
    });
};
exports.updateUserRole = updateUserRole;
