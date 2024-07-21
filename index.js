import express from "express";
import cors from "cors";
import { Items, db, Sales, Users } from "./models/index.js";
import userRoute from "./routes/userRoutes.js";
import saleRoute from "./routes/saleRoutes.js";
import ItemRoute from "./routes/itemRoutes.js";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";




dotenv.config();
const app = express();


try {
    await db.authenticate();
    console.log('Db Connect');
} catch (error) {
    console.log(error);
}


app.use(cookieParser());
app.use(express.json());
app.use(cors({credentials:true}));
app.use(userRoute);
app.use(saleRoute);
app.use(ItemRoute);


app.listen(3003, () => {
    console.log("Server Run In Port 3003");
})