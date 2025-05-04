require('dotenv').config({ path: './.env' });

const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const bodyParser=require("body-parser")
const path = require("path");

const PORT = process.env.PORT || 3002;
const MONGODB_URI= process.env.MONGODB_URI;

const app = express();

app.set('views',path.join(__dirname, 'views'));
app.set('view engine','ejs');


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.use(logger("dev"))


// || "mongodb://localhost/mongodb"

mongoose.connect(MONGODB_URI , {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true
});

// routes
app.use(require("./routes/api-routes.js"));
app.use(require("./routes/html-routes.js"));

app.listen(PORT, () => {
  console.log(`App running on port http://localhost:${PORT}`);
});