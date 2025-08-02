import express, { Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import { connectCloudinary } from './src/config/cloudinary'
import router from './src/routes/api'
import { CronSchedular } from './src/cronScheduler/CronSchedular'
//Initialize Express
const app = express()

connectCloudinary()

// Cron Scheduler
CronSchedular()
//Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH"],
  credentials: true,
  // allowedHeaders: ["Content-Type", "Authorization","token"],
}));
app.use(express.json())
app.use(cookieParser())

app.set('etag', false);



//Routes
app.use('/api/v1', router);

app.get('/', (req:Request,res:Response)=>res.send("API Working"))

app.use("*", (req:Request,res:Response) => {
    res.status(404).json({ status: "fail", data: "Incorrect API" });
});
//Port
const PORT = process.env.PORT || 4000
app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
})


