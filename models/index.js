import db from "../config/Database.js";
import Items from "./ItemModel.js";
import Users from "./UserModel.js";
import Sales from "./saleModel.js";

Users.hasMany(Sales, { foreignKey: 'idUser' });
Items.hasMany(Sales, { foreignKey: 'idItem' });
Sales.belongsTo(Users, { foreignKey: 'idUser' });
Sales.belongsTo(Items, { foreignKey: 'idItem' });

export  { db, Items, Users, Sales };
