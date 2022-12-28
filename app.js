const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const uuid = require('uuid')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Middleware to look into requests and extract their data 
app.use(express.urlencoded({ extended: false }))

//Serving Static files
app.use(express.static('public'))

//Creating Routes for different HTML pages
app.get('/', function (req, res) {
    res.render('index')

});
app.get('/restaurants', function (req, res) {

    const filePath = path.join(__dirname, 'data', 'restaurants.json');

    const fileData = fs.readFileSync(filePath);
    const storedRestaurants = JSON.parse(fileData);
    res.render('restaurants', {
        numberOfRestaurants: storedRestaurants.length,
        restaurants: storedRestaurants,
    });
});
app.get('/about', function (req, res) {
    res.render('about')
});
app.get('/confirm', function (req, res) {
    res.render('confirm')
});
app.get('/recommend', function (req, res) {
    res.render('recommend')
});

//Creating the Dynamic Route 
app.get('/restaurants/:id', function (req, res) {
    //Searching for the Item in the file with the same id as we get from the URL 
    const resId = req.params.id;

    const filePath = path.join(__dirname, 'data', 'restaurants.json');
    const fileData = fs.readFileSync(filePath);
    const storedRestaurants = JSON.parse(fileData);
    for (let rest of storedRestaurants) {
        if (rest.id === resId) {
             return res.render('restaurant-details', { restaurant: rest })
        }else{
            res.render('error.ejs')
        }
    }


});

//Creating Post Requets paths
app.post('/recommend', function (req, res) {
    const restaurant = req.body;
    //adding a unique ID with the help of uuid
    restaurant.id = uuid.v4();
    const filePath = path.join(__dirname, 'data', 'restaurants.json')
    const fileData = fs.readFileSync(filePath);
    const storedRestuarants = JSON.parse(fileData);

    storedRestuarants.push(restaurant);
    fs.writeFileSync(filePath, JSON.stringify(storedRestuarants));

    res.redirect('/confirm');

});

//adding a middleware for incorrect routes 
app.use(function(req,res){
res.render('error')
})
//adding a middleware for error on the server 
app.use(function(error,res,res,next){
res.render('500')
})
app.listen(4500);