var express = require("express");
var mongoose = require("mongoose");
const crypto = require("crypto");
var hash = crypto.createHash('sha256');
var passport = require("passport");
var LocalStrategy = require("passport-local");

mongoose.connect("mongodb://localhost/health_db");
var app = express();
var bodyParser = require("body-parser");
var HealthParameter = require("./models/healthparameter");
var User = require("./models/users");

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

app.use(require("express-session")({
  secret: "Software engineering 1",
  resave:false,
  saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");



app.get("/", function(req,res){
    res.render("landing");
});

app.get("/comparison",isLoggedIn,function(req,res){
    var avgData =[
      {avgAge: 33,avgWeight: 100,avgHeight: 5.8,avgBMI: 20,avgSleepPatterns:6,avgCholesterol:50,avgBloodSugar:120,
      avgBloodPressure:90}]
    res.render("comparison");
});

app.get("/mydata",isLoggedIn,function(req,res){
    HealthParameter.find({},function(err,myData){
        if(err){
          console.log(err);
        }else{
            res.render("mydata",{myData:myData});
        }
    });
});

app.get("/myhistory",isLoggedIn,function(req,res){
    HealthParameter.find({},function(err,myHistory){
        if(err){
          console.log(err);
        }else{
          res.render("myhistory",{myHistory:myHistory})
        }
    });
});

app.post("/mydata",isLoggedIn,function(req,res){
    var weight = req.body.weight;
    var height = req.body.height;
    var bmi = req.body.bmi;
    var spatterns = req.body.spatterns;
    var cholesterol = req.body.cholesterol;
    var bsugar = req.body.bsugar;
    var bp = req.body.bp;
    //var prevHash =
    var date = new Date();
    var timestamp = Date.now();
    var dateAndTime = date.toLocaleString();
    console.log(timestamp)
    console.log(dateAndTime)
    var newData = {
                    weight: weight,
                    height: height,
                    bmi: bmi,
                    sleepPatterns: spatterns,
                    cholesterol: cholesterol,
                    bloodSugar: bsugar,
                    bloodPressure: bp,
                    timeStamp: timestamp,
                    dateAndTime:dateAndTime}
    HealthParameter.create(newData,function(err, newCreated){
        if(err){
          console.log(err);
        }else{
          res.redirect("/mydata");
          console.log("Created user with health paramters");
        }
    });
});

app.get("/mydata/new",isLoggedIn,function(req,res){
    res.render("new.ejs");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password,function(err,user){
     if(err){
       console.log(err);
       return res.render("register")
     }
     passport.authenticate("local")(req,res,function(){
       res.redirect("/mydata");
     });
  });
});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate("local",
    {successRedirect: "/mydata",
     failureRedirect: "/login"
   }),function(req,res){
});

app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }
    res.render("login");
}

app.listen(3000,process.env.IP,function(){
    console.log("HealthColate+ server has started.");
});
