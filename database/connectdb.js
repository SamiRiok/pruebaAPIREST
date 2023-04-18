import mongoose from 'mongoose';
//CONEXION A LA BASE DE DATOS
try{
    await mongoose.connect(process.env.URI_MONGO)
    console.log("Conneccion DB OK")
} catch (error){
    console.log("Error de conexion: " + error)
}
