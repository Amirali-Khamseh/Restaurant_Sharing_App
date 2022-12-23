const express = require('express');
const path = require('path');
const fs =require('fs');
const app = express();

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//Middleware to look into requests and extract their data 
app.use(express.urlencoded({extended:false}))

//Serving Static files
app.use(express.static('public'))

//Creating Routes for different HTML pages
app.get('/',function(req,res){
    res.render('index')
    
});
app.get('/restaurants',function(req,res){

    const filePath = path.join(__dirname, 'data', 'restaurants.json');

    const fileData = fs.readFileSync(filePath);
    const storedRestaurants = JSON.parse(fileData);
   res.render('restaurants', {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedRestaurants,
  });
});
app.get('/about',function(req,res){
    res.render('about')
});
app.get('/confirm',function(req,res){
    res.render('confirm')
});
app.get('/recommend',function(req,res){
    res.render('recommend')
});
//Creating Post Requets paths
app.post('/recommend',function(req,res){
    const restaurant = req.body;

    const filePath = path.join(__dirname,'data','restaurants.json')
    const fileData =fs.readFileSync(filePath);
    const storedRestuarants = JSON.parse(fileData);

    storedRestuarants.push(restaurant);
    fs.writeFileSync(filePath,JSON.stringify(storedRestuarants));

    res.redirect('/confirm');
    
});


app.listen(4500);