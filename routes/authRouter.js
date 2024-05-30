import express from "express";
import authController from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();
const jsonParser = express.json();

router.post("/register", jsonParser, authController.register);
router.post("/login", jsonParser, authController.login);
router.get("/current", authMiddleware, authController.current);
router.post("/logout", authMiddleware, authController.logout);

export default router;
