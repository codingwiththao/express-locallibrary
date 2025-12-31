const process = require('node:process')
const mongoose = require('mongoose')
const Genre = require('./models/genre')

const dev_db_url =
  "mongodb+srv://USER:PASSWORD@cluster/.../local_library"

const mongoDB = process.env.MONGODB_URI || dev_db_url

(async () => {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(mongoDB)
    console.log('Connection established.')

    mongoose.connection.on(
      'error',
      console.error.bind(console, 'MongoDB connection error:')
    )

    const genres = await Genre.find().sort([['name', 'ascending']]).exec()
    console.log('Genres:', genres.join())

    console.log('Disconnecting...')
    await mongoose.connection.close()
    console.log('Connection closed.')
  }
  catch (err) {
    console.error('MongoDB connection failed:', err)
    process.exit(1)
  }
})()
