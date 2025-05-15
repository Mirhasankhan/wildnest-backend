"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/create", user_controller_1.UserControllers.createUser);
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.UserControllers.getUsers);
router.get("/:id", (0, auth_1.default)(), user_controller_1.UserControllers.getSingleUser);
router.put("/update", (0, validateRequest_1.default)(user_validation_1.userValidation.userUpdateValidationSchema), (0, auth_1.default)(), user_controller_1.UserControllers.updateUser);
// router.delete("/:id", UserControllers.deleteUser);
exports.userRoutes = router;
