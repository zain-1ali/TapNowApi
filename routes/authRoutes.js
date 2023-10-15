import express from "express";
import {
  loginController,
  registerController,
} from "../controllers/authControllers.js";
// import {
//   registerController,
//   loginController,
// } from "../controllers/authController.js";

// router Object
const router = express.Router();

// Register route
router.post("/register", registerController);

// Login route
router.post("/login", loginController);

export default router;
