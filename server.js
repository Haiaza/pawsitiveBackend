const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors')
const app = express();
const mongoose = require('mongoose');
// const verifyToken = require('./middleware/verify-token')
//routers
const usersRouter = require('./controllers/users')
const profilesRouter = require('./controllers/profiles')
const petsRouter = require('./controllers/pets')

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors())
app.use(express.json());
// app.use(verifyToken) // tweak when im ready to auth the app.

// Routes go here
app.use('/users', usersRouter)
app.use('/profiles', profilesRouter);
app.use('/pets', petsRouter)

app.use(cors({ origin: 'https://pawsitive-match.netlify.app/' }))

app.listen(3000, () => {
  console.log('The express app is ready!');
}); 
