import express from "express";
import { infoUser, login, register,refreshToken, logOut } from "../controllers/auth.controller.js";
import { body, validationResult } from "express-validator";
import {validationResultExpress} from "../middlewares/validationResultExpress.js"
import { requireToken } from "../middlewares/requireToken.js";
import { createEvent, getEventbyLocate } from "../controllers/event.controller.js";

const router = express.Router();

//RUTA PARA REGISTER Y COMPROBACION DE ERRORES EN EL MISMO
router.post("/register",[
    body("email", "Formato de email incorrecto")
        .trim()
        .isEmail()
        .normalizeEmail(),
    body("password", "Minimo 6 caracteres")
        .trim()
        .isLength({min:6}),
    body("password", "Formato de password incorrecto")
        .trim()
        .custom((value, {req}) =>{
            if(value !== req.body.repassword){
                throw new Error("No coinciden las contraseñas");
            }
            return value;
        })
    ],validationResultExpress
    ,register);

//RUTA PARA LOGIN Y COMPROBACION DE ERRORES EN EL MISMO
router.post("/login",[
    body("email", "Formato de email incorrecto")
        .trim()
        .isEmail()
        .normalizeEmail(),
    body("password", "Minimo 6 caracteres")
        .trim()
        .isLength({min:6}),
    ],validationResultExpress
     ,login);


//RUTA PARA ACCEDER AL PROTECTED Y PODER INSERTAR EVENTOS O BUSCARLOS
router.get("/protected",requireToken, infoUser)   

//REFRESH TOKEN
router.get("/refresh", refreshToken)  

//CIERRE DE SESION
router.get("/logout", logOut)

//PARA EVENTOS
//CREAR EVENTOS
router.post("/createEvent",requireToken, createEvent)
//BUSCAR EVENTOS
router.get("/getEvent",requireToken, getEventbyLocate)


export default router;
