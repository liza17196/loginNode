import mongoose from 'mongoose';

// import environmental variables from our variables.env file
require('dotenv').config({ path: '.env' });
require('./models/User');

// Connect to our Database and handle any bad connections
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`Error → ${err.message}`);
});


// Start our app!
const app = require('./app');
app.set('port', process.env.PORT || 8000);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
