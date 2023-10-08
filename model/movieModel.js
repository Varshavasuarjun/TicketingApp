const mongoose=require("mongoose");
movieSchema=mongoose.Schema({
    MovieName : "String", 
    Image :"String",
    Category:"String",
    Languages:"String",
    Cast:"String",
    
    
    seats:[{
        seatname:"String",
        disStatus:"Boolean"
          }],
   reviws:[{
          userName:"String",
          riviews:"String",
          ratings:"Number"
          }],
    Booking:["String"], 
    Description:"String",
    TicketRates:"Number",
    NoOfSeats:{
      type:  "Number",
      default:0
    },

    SeatAvailable:"Number",
    timing:"String"

})
movieModel=mongoose.model("movie",movieSchema);
module.exports=movieModel;