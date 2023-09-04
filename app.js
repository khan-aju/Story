//jshint esversion:6
import 'dotenv/config'
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import { set, connect, Schema, model } from "mongoose";
import encrypt from "mongoose-encryption";

const app=express();

set("strictQuery", false);
set("strictQuery", true);



console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser:true});

const userSchema=new Schema({
    email:String,
    password:String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});


const User=new model("User",userSchema);



app.get("/",(req,res)=>{
  res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login");
  });

  app.get("/register",(req,res)=>{
    res.render("register");
  });

 app.post("/register",(req,res)=>{
      
    const newUser=new User({
       email:req.body.username,
       password:req.body.password
    });
      newUser.save(function(err){
         if(err){
             console.log(err);
         }else{
            res.render("secrets");
         }
      });
 });

 app.post("/login",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    User.findOne({email:username},function(err,foundUser){
      if(err){
        console.log(err);
      }else{
        if(foundUser){
            if(foundUser.password===password){
                res.render("secrets");
            }
        }
      }
    });
 });






app.listen(3000,function(){
    console.log("server started on port 3000.");
});