import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Items from "./ItemModel.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Sales = db.define('sales', {
    salesId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    idUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: Users,
        key: 'userId'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
    },
    idItem: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: Items,
        key: 'itemId'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
    },
    mount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    freezeTableName:true
})

export default Sales;