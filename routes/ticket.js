const express=require("express");
const router=express.Router();

router.use(express.urlencoded({extended:false}));
router.use(express.json());
const jwt=require("jsonwebtoken")
const nodemailer=require('nodemailer');

const movieModel=require ("../model/movieModel");
const ticketBookingModel=require("../model/ticketBookings");

// get all movies booked by a perticular user
router.post('/getbookedtkts/:id', async(req,res)=>{
    const userId=req.params.id;
    const token = req.body.token;
    console.log(userId)
    try {
        let movies= await ticketBookingModel.find({"userId":userId}).sort({date:-1}).exec()
        jwt.verify(token,"movieTicket",
        (error,decoded)=>{
            if(decoded && decoded.email){
                // console.log(movies);
                res.json(movies);
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

// canceling tickets
router.post('/cancelticket/:id', async(req,res)=>{
    const tktId=req.params.id;
    const tktData=req.body;
    const token=req.body.token;
    const id=req.body.movieId;
    const seatNo=req.body.seatNo;
    console.log(tktData);
    try {
        jwt.verify(token,"movieTicket",
        (error,decoded)=>{
            if(decoded && decoded.email){
                let deleteTicket=  ticketBookingModel.findByIdAndDelete({"_id":tktId}).exec()
                console.log(deleteTicket);
                const seatStatus= movieModel.updateOne(
                    {_id:id,"seats.seatname": seatNo },
                     { $set: {'seats.$.disStatus': false },
                       $inc:{'SeatAvailable':1,"NoOfSeats":-1}  ,
                       
                     },{updeart:true}
                ).exec()
                console.log(seatStatus);
                res.json({message:"Ticket Cancelled"});
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
// Booking tickets
router.post("/bookticket/:id", (req,res)=>{
    const id=req.params.id;
    console.log(id)
    const data=req.body.seatNo;
    const token=req.body.token;
    const today=new Date();
    today.setHours(0, 0, 0, 0);

    const tkts={
        "userId": req.body.userId,
        "moivieId":req.body.moivieId,
        "movieName":req.body.movieName,
        "seatNo":req.body.seatNo,
        "date":req.body.date
    }
    const useremail=req.body.email;
    const content=req.body.text;
    console.log(req.body);
    var query={_id:id};
    try {
        jwt.verify(token,"movieTicket",
        (error,decoded)=>{
            if(decoded && decoded.email){
                const pot= movieModel.updateOne(
                    {_id:id,"seats.seatname": data },
                     { $set: {'seats.$.disStatus': true },
                       $inc:{'SeatAvailable':-1,"NoOfSeats":1}    
                     },{updeart:true}
                ).exec()
                const booking=  ticketBookingModel(tkts).save();
                    console.log(booking);
                    res.json({message:"seats updated"});
                
            } 
            else{
                res.status(400).json({message:"Unauthorised user"})
            }
        })  
        
      
    }
    catch (error) {
        console.log(error);
        res.json({message:"seats couldnt update"});
    }

})

module.exports=router;