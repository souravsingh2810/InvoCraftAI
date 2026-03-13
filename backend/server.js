import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express'
import { connectDB } from './config/db.js';
import path from 'path';
import invoiceRouter from './routes/invoiceRouter.js';
import businessProfileRouter from './routes/businessProfileRouter.js';
import aiInvoiceRouter from './routes/aiInvoiceRouter.js';

const app = express();
const port = process.env.PORT || 4000;
// Middleware
app.use(cors({
    origin: [
    "http://localhost:5173",
    "https://invo-craft-ai.vercel.app"
  ],
}));
// app.use(cors());
app.use(clerkMiddleware())
app.use(express.json({limit: "20mb"}))
app.use(express.urlencoded({limit:"20mb" , extended: true}));

//DB
connectDB()

// routes
app.use('/uploads', express.static(path.join(process.cwd(),"uploads")));
app.use('/api/invoice', invoiceRouter);
console.log("BusinessProfile route loaded");//....remove
app.use('/api/businessProfile',businessProfileRouter);
app.use('/api/ai',aiInvoiceRouter);
app.get('/', (req,res)=> {
    res.send("API WORKING")
});

app.listen(port, () =>{
    console.log(`Server Started on http://localhost:${port}`)
})
