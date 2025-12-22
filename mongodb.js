const process = require('node:process')
const mongoose = require('mongoose')
const Genre = require('./models/genre')

const mongoDB = process.env.MONGODB_URI
if (!mongoDB) {
    console.error('Environment variable MONGODB_URI must be set in order to connect to the MongoDB database.')
    process.exit(-1)
}

(async () => {
    try {
        console.log('Connecting...')
        await mongoose.connect(mongoDB)
        console.log('Connection to MongoDB established.')
        mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'))
        const genres = await Genre.find().sort([['name', 'ascending']]).exec()
        console.log('Genres: ', genres.join())
        console.log('Disconnecting...')
        await mongoose.connection.close()
        console.log('Connection to MongoDB closed.')
    }
    catch(err) {
        console.error('Connection to MongoDB failed: ', err)
        process.exit(-1)
    }
})()