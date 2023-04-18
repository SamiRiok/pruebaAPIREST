import {User} from "../models/User.js";
import { generateRefreshToken, generateToken} from "../utils/tokenManager.js";
import jwt from "jsonwebtoken";
import cookieParser from 'cookie-parser';

// REGISTRO DE USUARIOS
export const register = async(req, res)=>{
    const {email, password} = req.body;
    try {
        //ALTERNATIVA BUSCANDO POR EMAIL.
        let user = await User.findOne({email})
        if(user) throw {code: 11000}; 

        user = new User({email, password});
        await user.save();


        //TOKEN JWT

        return res.status(201).json({ ok: true});

    } catch (error) {
        console.log(error);
        //ALTERNATIVA POR DEFECTO MONGOOSE.
        if(error.code == 11000){
            return res.status(400).json({regError : "Email existente"})
        }
        return res.status(500).json({errorServidor: "algo ha fallado"});
    }

};


//LOGIN DE USUARIOS
export const login = async(req, res)=>{
    try {
        const { email, password } = req.body;

        //COMPROBAR QUE EXISTE EL EMAIL
        let user = await User.findOne({ email })
        if(!user)
            return res.status(403).json({error : "No existe el usuario al que deseas acceder"});
        
        //COMPROBAR QUE LA CONTRASEÑA ES CORECTA

        const respPasswd = await user.comparePassword(password);
        if(!respPasswd){
            return res.status(403).json({error: "Contraseña incorrecta"})
        }

        //GENERAR EL TOKEN JWT
        const {token, expiresIn} = generateToken(user.id)
        generateRefreshToken(user.id, res)

        return res.json({token, expiresIn});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error : "Error de servidor"});
    }
};

//DEVULEVE LA INFORAMCION DEL USUARIO, EN ESTE CASO DEVUELVE EL EMAIL Y EL UID PARA HACER EL PAYLOAD
export const infoUser =  async (req, res) => {
    try {
        const user = await User.findById(req.uid).lean();
        return res.json({email: user.email, uid: user.id})
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}

//REFRESH TOKEN PARA REFORZAR LA SEGURIDAD DEL SITIO WEB
export const refreshToken = (req, res) =>{
    try {
        cookieParser()(req, res, () => {
            const refreshTokenCookie = req.cookies.refreshToken;
            if(!refreshTokenCookie) throw new Error("No token")
            
            const {uid} = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);
    
            const {token, expiresIn} = generateToken(uid)
    
            return res.json({token, expiresIn});
        });
    } catch (error) {
        console.log(error.message);
        //MANEJO DE ERRORES
        const TokenVerificationErrors = {
            "invalid signature": "La firma del JWT no es valida",
            "jwt expired": "JWT expirado",
            "invalid token": "Token no valido",
            "no Bearer": "Utiliza formato Bearer",
            "jwt malformed": "Formato de token invalido"
        };
        return res
            .status(401)
            .send({error:TokenVerificationErrors[error.message]});
        
    }
    
}

//CIERRE DE SESION
export const logOut = (req, res) => {
    res.clearCookie("refreshToken")
    res.json({ok: true});
}

