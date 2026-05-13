import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './src/config/db'
import { limiter } from './src/middleware/rateLimit'
import auditRoutes from './src/routes/audit.routes'
import leadRoutes from './src/routes/lead.routes'
import { errorHandler } from './src/middleware/errorHandler'

dotenv.config()
connectDB()

const app = express()

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Backend is running'
  })
})
app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())
app.use(limiter)

app.use('/api/audit', auditRoutes)
app.use('/api/lead', leadRoutes)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})