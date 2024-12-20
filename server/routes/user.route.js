"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/registration", user_controller_1.registrationUser);
router.post("/activate-user", user_controller_1.activateUser);
router.post("/login", user_controller_1.LoginUser);
router.get("/logout", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('admin'), user_controller_1.logoutUser);
router.get("/refresh", user_controller_1.updateAccessToken);
router.get("/me", auth_1.isAuthenticated, user_controller_1.getUserInfo);
router.post("/social-auth", user_controller_1.socialAuth);
router.put("/update-user-info", auth_1.isAuthenticated, user_controller_1.updateUserInfo);
router.put("/update-user-password", auth_1.isAuthenticated, user_controller_1.updatePassword);
// router.put("/update-user-avatar", isAuthenticated, updateProfilePicture)
router.get("/get-all-users-admin", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('admin'), user_controller_1.fetchAllUsers);
router.put("/update-user-role", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('admin'), user_controller_1.updateRole);
router.delete("/delete-user/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('admin'), user_controller_1.deleteUser);
exports.default = router;
