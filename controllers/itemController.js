import { Items } from "../models/index.js";

export const getItems = async (req, res) => {
    try {
        const response = await Items.findAll();
        res.status(200).json(response); 
    } catch (error) {
        console.log(error);    
    }
}
