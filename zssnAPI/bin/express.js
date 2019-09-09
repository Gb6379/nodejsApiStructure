const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const variables = require('./configuration/variables');
mongoose.set('useCreateIndex', true);

//routers
const survivorRouter = require('../routes/surivevors-router');
const reportRouter = require('../routes/report-router');
//API serverweb express
const app = express();

//JSON parse config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));//true ?

//database connect
mongoose.connect(variables.Database.connection, {useNewUrlParser : true});

//config routes
app.use('/api/survivor', survivorRouter);
app.use('/api/', reportRouter);


module.exports = app;