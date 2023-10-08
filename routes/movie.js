const express=require("express");
const router=express.Router();
const jwt=require("jsonwebtoken")
router.use(express.urlencoded({extended:false}));
router.use(express.json());

const nodemailer=require('nodemailer');

const movieModel=require ("../model/movieModel");
const ticketBookingModel=require("../model/ticketBookings");

// view all movies
router.post("/viewMovies", async(req,res)=>{
    console.log(req.body)
    const movies=await movieModel.find()
    try {
        console.log(movies);
        res.json({message:"moviess",movies})
    } catch (err) {
       console.log(err) ;
       res.json("err");
    }
})

// view a perticular movie 
router.post("/viewMovie/:id", async(req,res)=>{
    const movieId=req.params.id;
    const token=req.body.token;
    const email=req.body.email;

    console.log(movieId)
    const movie =await movieModel.findOne({_id:movieId})
    try {
        jwt.verify(token,"movieTicket",
        (error,decoded)=>{
            if(decoded && decoded.email){
                res.status(200).send(movie);     
            } 
            else{
                res.status(400).json({message:"Unauthorised user"})
            }
        })      
    } catch (err) {
       console.log(err) ;
       res.json("err");
    }
})

// save reviews in db
router.post('/addreviews/:id', (req,res)=>{
    const id=req.params.id;
    console.log(req.body);
    const reviwes={
        "userName": req.body.userName,
        "riviews":req.body.Input.riviews,
        "ratings":req.body. rateingval,
    }
    const email=req.body.email
    const token=req.body.token
    console.log(token)
    console.log(email)
    console.log(reviwes);
    console.log(id);
    try {
        jwt.verify(token,"movieTicket",
        (error,decoded)=>{
            if(decoded && decoded.email){
                const addReviw=  movieModel.findByIdAndUpdate(id,{
                    $push:{
                     reviws:reviwes,
                    },
             }) .exec();
             res.json({message:"Thank you for the review",addReviw});
             console.log(addReviw);
                
            } 
            else{
                res.status(400).json({message:"Unauthorised user"})
            }
        })  
       
    }
    catch (error) {
        console.log(error) ;
        res.json("error");
    }
})    
// send conformation mail
router.post('/sendmail',  (req,res)=>{
    const email=req.body.email;
    const content=req.body.text;
    const token=req.body.token;

    var transporter = nodemailer.createTransport(
        {
            service:'gmail',
            auth:{
                user: 'varshavaeu47@gmail.com',
                
                pass:' djjj yrlq dlte zmhu '
               
            }
        })
     var mailOption={
        from:'Movie Booking App',
         to:email,
         subject:'ticket booking conformd',
          text:content
     }
   try {
    jwt.verify(token,"movieTicket",
    (error,decoded)=>{
        if(decoded && decoded.email){
            transporter.sendMail(mailOption);
            res.json({message:"email sent successfully"})
        } 
        else{
            res.status(400).json({message:"Unauthorised user"})
        }
    })  
   
       
   }
    catch (error) {
        console.log(error);
        res.json({error:"email couldnt sent"});
    
   }    
})


module.exports=router;