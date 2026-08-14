import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoutes.js'

const app = express()
const port = process.env.PORT || 4000

connectDB()
connectCloudinary()

app.use(express.json())

// ✅ CORS - Sabhi localhost ports allow karo
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",  // ✅ Admin panel ka port add karo
    "http://localhost:3000",
    "https://dr-appointment-1.onrender.com",
    "https://dr-appointment-admin-panel.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}))

// ✅ Routes
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

// ✅ TEST ROUTE
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Backend is running!',
        database: 'Connected ✅'
    })
})

// ✅ DEBUG ROUTE
app.get('/api/debug', async (req, res) => {
    try {
        const mongoose = (await import('mongoose')).default;
        const collections = await mongoose.connection.db.listCollections().toArray();
        res.json({
            success: true,
            database: mongoose.connection.name,
            collections: collections.map(c => c.name)
        })
    } catch (error) {
        res.json({ success: false, error: error.message })
    }
})

app.get('/', (req, res) => {
    res.send("Api working ")
})

app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`)
    console.log(`📋 Doctors: http://localhost:${port}/api/doctor/list`)
    console.log(`📋 Test: http://localhost:${port}/api/test`)
})