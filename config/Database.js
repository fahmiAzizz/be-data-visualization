import { Sequelize } from "sequelize";

const db = new Sequelize('db_visualization', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
  });

export default db;