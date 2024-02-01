//=============== SETUP ===============//

// env
require('dotenv').config();

// express
const express = require('express');
const app = express();

// route table
const rowdy = require ('rowdy-logger');
const routesReport = rowdy.begin(app);

// route modules
const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const taskRoutes = require('./routes/taskRoutes');

// allow json body for api write methods
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
// allow http requests
app.use(require('cors')());

// logger for server requests
const morgan = require('morgan');
app.use(morgan('tiny'));


//=============== ROUTES ===============//

app.use('/user', userRoutes);
app.use('/tickets', ticketRoutes);
app.use('/tasks', taskRoutes);


//=============== SERVER ===============//

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`backend server on port ${PORT}`);
  routesReport.print();
})
