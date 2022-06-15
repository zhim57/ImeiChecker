const path = require("path");
const router = require("express").Router();
const bodyParser= require("body-parser");
// const { redirect } = require("express/lib/response");
const request = require("request");


  router.get("/result", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/result.html"));
  });
  router.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/exercise.html"));
  });

  router.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });
  router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });
  // router.get("", (req, res) => {
  //   res.sendFile(path.join(__dirname, "../public/index.html"));
  // });
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
  // res.render("test1.ejs");
  });
  router.get("/login", (req, res)=>{
      
    res.render("login.ejs");
  // res.render("test1.ejs");
  });
  router.get("/dashboard", (req, res)=>{
    
    res.render("dashboard.ejs");
  // res.render("test1.ejs");
  });
  router.get("/dudur", (req, res)=>{
    
    res.render("test1.ejs");
  // res.render("test1.ejs");
  });
  router.get("/result1", (req, res)=>{
    let imei= req.query.search;
    console.log(imei);
    // let imei= "353283075129556";
    request('https://imeidb.xyz/api/imei/'+ imei+'?token=hLXML4jCI-ekWSoSBq4F&format=json', (error,response,body) => {

      if (error){
        console.log(error);
      }
      let data= JSON.parse(body);
      res.render("imeis.ejs",{data:data});
    });
    
  // res.render("test1.ejs");
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