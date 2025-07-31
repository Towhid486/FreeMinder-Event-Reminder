import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import { connectCloudinary } from './src/config/cloudinary'
import router from './src/routes/api'

//Initialize Express
const app = express()

connectCloudinary()

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

app.get('/', (req,res)=>res.send("API Working"))


//Port
const PORT = process.env.PORT || 4000
app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
})
