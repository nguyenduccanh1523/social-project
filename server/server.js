import express from 'express'
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors'
import initRoutes from './src/routes/index.js'
import connectDatabase from './src/config/connectDatabase.js'

const app = express()
app.use(cors({
    origin: 'http://localhost:4000',
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.options('*', cors({
    origin: 'http://localhost:4000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

initRoutes(app)
connectDatabase()

app.get('/', (req, res) => { res.send('server is running') })

const PORT = process.env.PORT || 8989
const listener = app.listen(PORT, () => {
    console.log(`Server is running on port ${listener.address().port}`)
})