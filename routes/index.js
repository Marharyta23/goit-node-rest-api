import express from "express";

import authRouter from "./authRouter.js";
import contactsRouter from "./contactsRouter.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use("/users", authRouter);
router.use("/contacts", authMiddleware, contactsRouter);

export default router;
