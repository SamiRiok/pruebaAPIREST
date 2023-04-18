import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

//MODELLO DE USUARIOS
const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        index: {unique: true},

    },
    password:{
        type: String,
        required: true,
                
    }
});

userSchema.pre("save", async function (next){
    const user = this

    //EN CASO DE QUE EN UN FUTURO SE PUDIERA MODIFICAR EL USUARIO PARA NO VOLVLER A HASHEAR LA CONTRASEÑA
    if(!user.isModified("password")) return next();

    try {
        //CREACION DE CONTRASEÑAS TOTALMENTE SEGURAS, EL HASH ES SIEMPRE DISTINTO AUNQUE SEA LA MISMA CONTRASEÑA
        //LO QUE CREA UNAS CONTRASEÑAS SUMAMENTE DIFICILES DE DESCIFRAR GRACIAS A BYCRYPTJS
        const salt = await bcryptjs.genSalt(10)
        user.password = await bcryptjs.hash(user.password, salt)
        next()
    } catch (error) {
        console.log(error)
        throw new Error("fallo el hash de contraseña")
    }
});

//COMPARACION DE CONTRASEÑAS MEDIANTE BYCRYPTJS
userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcryptjs.compare(candidatePassword, this.password);
}

export const User = mongoose.model("User", userSchema);