import 'dotenv/config';
import "./database/connectdb.js"
import express from 'express'
import cookieParser from 'cookie-parser';
import authRouter from "./routes/auth.route.js"

const app = express();

app.use(express.json());
app.use("/api/v1", authRouter);
app.use(cookieParser());

app.use(express.static("public"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("🧨🧨🧨 http://localhost:"+PORT));
