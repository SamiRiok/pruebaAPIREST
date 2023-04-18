import {Event} from "../models/Events.js";
//CONTROL PARA LOS EVENTOS, PUDIENDO CREAR EVENTOS O BUSCARLOS

//CREAR EVENTOS
export const createEvent = async (req, res) =>{
    const {evento, fecha, ubicacion} = req.body;
    try {

        let event = new Event({evento, fecha, ubicacion});
        await event.save();

        return res.status(201).json({ ok: true});

    } catch (error) {
        return res.status(500).json({errorServidor: "algo ha fallado"});
    }
}
//BUSCAR EVENTOS POR UBICACION Y FECHA
export const getEventbyLocate = async (req, res) =>{
    try {
        const ubicacion = req.query.ubicacion;
        const date = req.query.fecha;
        const ubicacionSLower = ubicacion.toLowerCase();

        const events = await Event.find({ ubicacion: ubicacionSLower, fecha: { $gte: new Date(date) } });
        if(events.length > 0){
            return res.json({ events });
        }
        else{
            return res.status(404).json({error: "Not Found"});
        }
        
    } catch (error) {
        console.log(error);
        return res.status(404).json({error: error.message})
    }
}
