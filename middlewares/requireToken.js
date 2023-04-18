import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

//CONTROL DE LA APIREST CON TOKENS
export const requireToken = (req,res,next) =>{
    try {
        cookieParser()(req, res, () => {
            let token = req.headers?.authorization;
            if(!token) 
                throw new Error("No existe el token en el header usa Bearer")
        
            token = token.split(" ")[1]
            const {uid} = jwt.verify(token, process.env.JWT_SECRET)
        
            req.uid = uid;
        
            next();
        })   
    } catch (error) {
        //CONTROL DE ERRORES EN LOS TOKENS
        console.log(error.message);
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