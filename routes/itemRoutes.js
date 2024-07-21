import { getItems } from "../controllers/itemController.js";
import express from "express";

const router = express.Router();

router.get('/items', getItems);

export default router;