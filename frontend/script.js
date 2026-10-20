const express = require('express');
const path = require('path');
var app = express();
// Require Sequel for Database
const sequelize = require("./db");
var patientRouter = require('./routes/patients');

var createError = require('http-errors');

// Make it So it Can Read Response Data
app.use(express.urlencoded({ extended: true }));

// Gets the Thing to Look in The Views Folder/Can Render .ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Listens on Port 3000
app.listen(3000, function() {});

// Pages Setup
app.set("pages", path.join(__dirname, "pages"));
app.set("view engine", "ejs");

// Express Setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/pages")));

// Use Router Files For Post/Get
app.use('/', patientRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Defining Setup
async function setup(){
    const Patients = require('./models/Patient');
    const patient1 = await Patients.create({firstname: "Michael", lastname:"Kelly", gender:"Spiral", age: 47, appointmentSched: 10, waitingTime: 9, quality: 1, purpose: "Major Reconstruction"});
}

// Creates a Database if There Is None
sequelize.sync({ force: true }).then(()=>{
  console.log("Sequelize Sync Completed...");
  setup().then(()=> console.log("User setup complete"))
})

module.exports = app;