const express=require("express");
const router=express.Router();

const userModel=require("../model/userModel");
const adminModel=require("../model/adminModel");
const jwt=require("jsonwebtoken")
 router.use(express.urlencoded({extended:false}));
 router.use(express.json());

//  user signup
 router.post("/signup", async (req,res)=>{
    const userData= req.body;
    let email= req.body.email;
    let user = await userModel.findOne({email:email});
    if(user){
        console.log("you are alredy registerd")
        res.json({message:"Already registered"});
    }
    else{
        const data= await userModel(userData).save();
        res.json({message:"Registered succesfully"});
    }

 })

// user  and admin login
router.post("/login",async (req,res)=>{
    const email=req.body.email;
    const password=req. body.password;
    console.log(email);
    console.log(password);
    const user= await userModel.findOne({email:email});
    try {
        if(!user){
            const admin= await adminModel.findOne({email:email});
            if(!admin){
                res.json({message:"no such user found"}); 
            }
            else{
                if(admin.password==password){
                    jwt.sign({email:email,id:admin._id},"movieadmin",{expiresIn:'1d'},
                    (error,token)=>{
                        if (error) {
                            res.json({message:"Token not generated"})
                        } else {
                            console.log(admin)
                            res.json({message:"admin login  successfull",token:token,data:admin});
                        }
                    })
                }
                else{
                    res.json({message:"password doesn't match"}); 
                }

            }
        }
        else{
                if(user.password==password){
                    jwt.sign({email:email,id:user._id},"movieTicket",{expiresIn:"1d"},
                    (error,token)=>{
                        if (error) {
                            res.json({message:"Token not generated"})
                        } else {
                           console.log(user)
                           res.json({message:"login successfull",token:token,data:user});
                        }
                    })
                }
                
                else{
                    console.log("password");
                    res.status(200).json({message:"Incorrect Password"}) 
                }
            } 
        }  
        catch (error) {
            res.json({message:"Un-authorised Login"});
        }  
    })    
      

   

 module.exports=router;
