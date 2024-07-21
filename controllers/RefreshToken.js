import  Users  from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401).json({msg:"Token tidak ke Refresh"});
        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });
        if (!user[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);
            const userId = user[0].userId;
            const username = user[0].username;
            const position = user[0].position;
            const email = user[0].email;
            const accessToken = jwt.sign({ userId, username, position, email }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '60s'
            })
            res.json({accessToken})
        })
    } catch (error) {
        console.log(error);
    }
}