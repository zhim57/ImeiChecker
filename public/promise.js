const fs = require("fs");
const request = require ("request");


fs.readfile("movie.txt", (error,query) =>{

  if(error) return console.log(error);

  request("https://api.themoviedb.org/3/search/movie?api_key=19ad416db5f018cc8b2482a686.....")

  let movies = JSON.parse(body)
})


const  readMovieFilePormise =(filename)=> {
  return new Promise ((resolve, reject)=>{
    fs.readFile(filename,(error,data)=>{
      if(error) reject(error);
      resolve(data);
    })

  })
}



readMovieFilePromise("movie.txt")
.then(query =>{
  return "https://api.themoviedb.org/3/search/movie?api_key=19ad416db5f018cc8b2482a....."
})
.then(url =>{
  request(url, {timeout:0})
  .then(body=>{

  })
}

)