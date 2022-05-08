const path = require("path");
const router = require("express").Router();


  router.get("/result", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/result.html"));
  });
  router.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/exercise.html"));
  });

  router.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/stats.html"));
  });
  router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/stats.html"));
  });
  router.get("/dudu", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/test1.html"));
  });
  
  
  router.get("/dudu/:id/:username" , (req, res)=>{
    
    let userId= req.params.id;
    let user= req.params.username;
    res.render("test1.ejs", {id:userId, username: user});

  });
    router.get("/test1 ", (req, res)=>{
      
      res.sendFile(path.join(__dirname, "../public/test1.html"));
    // res.render("test1.ejs");
  });
  

  module.exports = router;