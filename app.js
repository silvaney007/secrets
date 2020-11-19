const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption"); 
require('dotenv').config();



const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true,
}));


mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});
   
 
const secret = process.env.ENCRYPT;

userSchema.plugin(encrypt,{secret:secret, encryptedFields:['password']}); 

const User = new mongoose.model("USER", userSchema);
 

app.get("/", function (req, res) {
    res.render("home");
});


app.get("/login", function (req, res) {
    res.render("login");
});


app.get("/register", function (req, res) {

    res.render("register");
});

app.get("/logout", function (req, res) {

    res.render("home");
});


app.post("/login", function (req, res) {

    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, function (err, foundUser) {

        if (err) {
            console.log(err.message)
        } else {
            foundUser.password === password ? res.render("secrets") : res.render("login");
        }
    });

});


app.post("/register", function (req, res) {

    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save(function (err) {
        err ? res.render("register") : res.render("secrets");
    })

});



app.listen(3000, function () {
    console.log("Server started");
})