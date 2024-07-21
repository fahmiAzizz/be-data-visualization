import { createSales, getDailySalesWithRevenue, getMonthlySalesWithRevenue, getSales } from "../controllers/saleController.js";
import express from "express";

const router = express.Router();

router.get('/sales', getSales);
router.post('/sales', createSales);
router.get('/sales/daily', getDailySalesWithRevenue);
router.get('/sales/month', getMonthlySalesWithRevenue);

export default router;