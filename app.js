const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const port = process.env.PORT || 8080
const app = express()

app.use(express.json())
app.use('/auth', require('./routes/auth'))

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    app.listen(port, () => console.log(`App listening on port ${port}`))
    console.log('Connected to DB')
  } catch (error) {
    console.log('Server error', error)
    process.exit(1)
  }
}

start()
