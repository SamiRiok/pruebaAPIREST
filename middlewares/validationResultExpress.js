import { validationResult } from "express-validator";


//VALIDACION RAPIDA PARA COMPROBAR ERRORES EN CAMPOS
export const validationResultExpress = (req,res,next) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    next();
};