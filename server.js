const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const bodyParser=require("body-parser")
const path = require("path");

const PORT = process.env.PORT || 3000;

const app = express();

app.set('views',path.join(__dirname, 'views'));
app.set('view engine','ejs');


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.use(logger("dev"))




mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/mongodb", {
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