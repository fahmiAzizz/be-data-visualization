import  Users  from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
    try {
        const response = await Users.findAll();
        res.status(200).json(response); 
    } catch (error) {
        console.log(error);    
    }
}

export const Register = async (req, res) => {
    const { username,position, email, password, confPassword } = req.body;
    
    if (password !== confPassword) return res.status(400).json({ msg: "password dan confirm password tidak cocok" });
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    
    try {
        const existingUser = await Users.findOne({
            where: {
                email: email
            }
        });
        if (existingUser) return res.status(400).json({ msg: "email sudah pernah daftar" });
        
        await Users.create({
            username: username,
            email: email,
            position: position,
            password: hashPassword
        });
        res.json({ msg: "Register Berhasil" });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
}


export const Login = async (req, res) => {
    try {
        const user = await Users.findAll({
            where: {
                email: req.body.email
            }
        });

        const match = await bcrypt.compare(req.body.password, user[0].password);
        if (!match) return res.status(400).json({ msg: "password salah" });
        const userId = user[0].userId;
        const username = user[0].username;
        const position = user[0].position;
        const email = user[0].email;
        const accessToken = jwt.sign({ userId, username,position, email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '5s'
        });
        const refreshToken = jwt.sign({ userId, username,position, email }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        })
        await Users.update({ refresh_token: refreshToken }, {
            where: {
                userId: userId
            }
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json(accessToken)
    } catch (error) {
        console.log(error);
    }
}


export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(204);
        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });
    if (!user[0]) return res.sendStatus(204);
    const UserId = user[0].id;
    await Users.update({ refreshToken: null }, {
        where: {
            id: UserId
        }
    });
    res.clearCookie('refreshToken');
    return res.json({msg:"Logout Complete"});
}