const express=require("express");
const router=express.Router();
const jwt=require("jsonwebtoken")
router.use(express.urlencoded({extended:false}));
router.use(express.json());
const cron= require('node-cron')
const movieModel=require ("../model/movieModel");

cron.schedule('0 0 * * *', async ()=>{
    await movieModel.updateMany({},{$set:{"NoOfSeats":0}})
})
cron.schedule('0 0 * * *', async ()=>{
    await movieModel.updateMany({},{$set:{"seats.$[].disStatus": false}})
})

// add movie
router.post("/addMovie/:id", async(req,res)=>{
    const newMovie=req.body;
    const token=req.params.id;
    // const email=req.params.email;
    console.log(token);
    console.log("first")
    const addMovie=await movieModel(newMovie)
    try {
       
        jwt.verify(token,"movieadmin",
        (error,decoded)=>{
            if(decoded && decoded.email){
                addMovie.save()
                res.status(200).json({message:"movie added succesfully"})
                
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

// get avg rating of all movies
router.post("/getavg", async(req,res)=>{
    const input=req.body;
    try {
        const ratings=await movieModel.aggregate([
            {$unwind : "$reviws"},
            {$group:{ _id:"$_id", avgRating:{ $avg :"$reviws.ratings"}}}
            
        ])
        console.log(ratings)
        res.status(200).send(ratings);
        
    } catch (err) {
       console.log(err) ;
       res.json("err");
    }
})


// delete a movie
router.post("/deleteMovie/:id", (req,res)=>{
    const movieId=req.params.id;
    const token=req.body.token;
    console.log(token)
    console.log(movieId)
    try {
        jwt.verify(token,"movieadmin",
        (error,decoded)=>{
            if(decoded && decoded.email){
                const movie=  movieModel.findByIdAndDelete({_id:movieId}).exec()
                res.status(200).json({message:"movie removed successfully"});
                
            } 
            else{
                res.status(400).json({message:"Unauthorised user"})
            }
        })  
       
    } 
    catch (error) {
        console.log(error);
        res.json({message:"something went wrong"});
    }  
 }) 

//  update ticket rate and timing
router.post("/updateticket/:id", (req,res)=>{
    const movieId=req.params.id;
    const token=req.body.token;
    const newRate=req.body.TicketRates;
    const newtiming=req.body.timing;
    console.log(req.body)
    console.log(newRate)
console.log(newtiming)
    
    try { 
        jwt.verify(token,"movieadmin",
        (error,decoded)=>{
            if(decoded && decoded.email){
                const pot= movieModel.updateOne(
                    {_id:movieId },
                     { $set: {'TicketRates': newRate,
                    'timing':newtiming}},
                     {updeart:true}
                ).exec()
            
                     console.log("pot")
                   
                    res.status(200).json({message:"updated successfully"});
                    
            } 
            else{
                res.status(400).json({message:"Unauthorised user"})
            }
        })  
       
    } 
    catch (error) {
        console.log(error);
        res.json({message:"something went wrong"});

    }
   
 })

module.exports=router;
