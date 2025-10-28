const path = require("path");
const router = require("express").Router();
const bodyParser= require("body-parser");
const fetch = global.fetch || ((...args) => import('node-fetch').then(({default: f}) => f(...args)));


  router.get("/result", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/result.html"));
  });
  router.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/exercise.html"));
  });
  router.get("/imei_stats", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/imei_stats.html"));
  });

  router.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });
  router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });
  router.get("/dudu", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });
  
  
  router.get("/dudu/:id/:username" , (req, res)=>{
    
    let userId= req.params.id;
    let user= req.params.username;
    res.render("test1.ejs", {id:userId, username: user});

  });
  router.get("/search", (req, res)=>{
      
    res.render("search.ejs");
  });
  router.get("/login", (req, res)=>{
      
    res.render("login.ejs");
  });
  router.get("/dashboard", (req, res)=>{
    
    res.render("dashboard.ejs");
  });
  router.get("/dudur", (req, res)=>{
    
    res.render("test1.ejs");
  });
  router.get("/result1", async (req, res) => {
    let imei = req.query.search;
    console.log(imei);
    try {
      const response = await fetch(
        "https://imeidb.xyz/api/imei/" +
          imei +
          "?token=" +
          process.env.IMEI_API_TOKEN +
          "&format=json"
      );
      const data = await response.json();
      res.render("imeis.ejs", { data });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Failed to fetch IMEI" });
    }

  });
  
  
  router.post("/login", (req, res)=>{
  
    let username = req.body.username;
    let password = req.body.password;
  console.log(username);
    if (username === "john" && password === "pass"){
      res.redirect("/dashboard");
    }
    else{
      res.redirect("/dudur");
    }
    
   
    });
  

  module.exports = router;