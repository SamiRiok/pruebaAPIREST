import jwt from "jsonwebtoken";


//SIEMPRE SE GENERA UN NUEVO TOKEN
export const generateToken = (uid) =>{
    //TIEMPO DE VIDA DEL TOKEN EN ESTE CASO 15 MINUTOS
    const expiresIn = 60 * 15
    try {
        const token = jwt.sign({uid}, process.env.JWT_SECRET, {expiresIn})
        return {token, expiresIn}


    } catch (error) {
        console.log(error.message);
    }
}

//GENERAMOS UN REFRESH TOKEN PARA GUARDARLO EN LA COOKIE INTERNA
export const generateRefreshToken = (uid, res) =>{
    const expiresIn = 60*60*24*30
    try {
        const refreshToken = jwt.sign({uid}, process.env.JWT_REFRESH, {expiresIn})
        //GUARDAMOS ESTA COOKIE DE FORMA TOTALMENTE SEGURA EN UNA COOKIE QUE SOLO PUEDE ACCEDER EL SERVIDOR
        //PARA ASI NO TENER QUE GUARDAR NUNCA EL TOKEN REAL, ESTO FUNCIONA MEDIANTE UN TOKEN DE REFERESH QUE 
        //DA ACCESO A UN NUEVO TOKEN CADA VEZ QUE SE NECESITA
        res.cookie("refreshToken", refreshToken,{
            httpOnly: true,
            secure: !(process.env.MODO === "developer"),
            expires: new Date(Date.now()+ expiresIn * 1000)
        });
    } catch (error) {
        console.log(error.message);
    }
}