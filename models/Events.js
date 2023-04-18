import mongoose from "mongoose";

//MODELO DE EVENTOS.
const eventSchema = new mongoose.Schema({
    evento:{
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    fecha:{
        type: Date,
        required: false,
        trim: true
    },
    ubicacion:{
        type: String,
        required: true,
        trim: true,
        lowercase: true
    }

});

eventSchema.pre("save", async function (next){
    next()
});


export const Event = mongoose.model("Event", eventSchema);