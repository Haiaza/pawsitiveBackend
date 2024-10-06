const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
//routers
const usersRouter = require('./controllers/users')
const profilesRouter = require('./controllers/profiles')
const petsRouter = require('./controllers/pets')

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.json());

// Routes go here
app.use('/users', usersRouter)
app.use('/profiles', profilesRouter);
app.use('/pets', petsRouter)

app.listen(3000, () => {
  console.log('The express app is ready!');
}); 
