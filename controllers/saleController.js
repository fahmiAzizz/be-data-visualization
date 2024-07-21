import { Sales, Items } from "../models/index.js";
import { Op } from "sequelize";

export const getSales = async (req, res) => {
    try {
        const response = await Sales.findAll();
        res.status(200).json(response); 
    } catch (error) {
        console.log(error);    
    }
}

export const getDailySales = async (req, res) => {
    const targetDate = new Date(); // Gunakan tanggal saat ini
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    try {
        const sales = await Sales.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            }
        });

        res.status(200).json(sales);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const getMonthlySales = async (req, res) => {
    const currentDate = new Date();
    const year = req.query.year || currentDate.getFullYear();
    const month = req.query.month || currentDate.getMonth() + 1; // Bulan dalam JavaScript 0-indexed

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    try {
        const sales = await Sales.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        });

        res.status(200).json(sales);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const createSales = async (req, res) => {
    const { idUser, idItem, mount } = req.body;
    
    try {
        // Dapatkan harga item berdasarkan idItem
        const item = await Items.findOne({ where: { itemId: idItem } });
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        const price = item.price;
        const totalPrice = price * mount;

        // Buat entri baru di tabel Sales
        const newSale = await Sales.create({
            idUser,
            idItem,
            mount,
            totalPrice
        });

        res.status(201).json(newSale);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


// Mendapatkan data penjualan harian dengan total pendapatan
export const getDailySalesWithRevenue = async (req, res) => {
    const targetDate = new Date(); // Gunakan tanggal saat ini
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    try {
        // Ambil data penjualan
        const sales = await Sales.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            }
        });

        // Hitung total pendapatan dan jumlah transaksi
        const totalRevenue = sales.reduce((total, sale) => total + sale.totalPrice, 0);
        const transactionCount = sales.length;

        res.status(200).json({
            date: targetDate.toDateString(),
            totalRevenue,
            transactionCount,
            sales
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Mendapatkan data penjualan bulanan dengan total pendapatan
export const getMonthlySalesWithRevenue = async (req, res) => {
    const currentDate = new Date();
    const year = req.query.year || currentDate.getFullYear();
    const month = req.query.month || currentDate.getMonth() + 1; // Bulan dalam JavaScript 0-indexed

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    try {
        // Ambil data penjualan
        const sales = await Sales.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        });

        // Hitung total pendapatan dan jumlah transaksi
        const totalRevenue = sales.reduce((total, sale) => total + sale.totalPrice, 0);
        const transactionCount = sales.length;

        res.status(200).json({
            year,
            month,
            totalRevenue,
            transactionCount,
            sales
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};