import mongoose from "mongoose";

let userschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
     DOB:{
        type:Date,
        
    },
    addrass:{
        type:String,
    
    },
     prooftype:{
        type:String,
    
    },
   
    password:{
        type:String,
        required:true
    },
    usertype:{
        type:String,
    },
    proofnum:{
        type:String,
    },
    profileImage :{
        type:String,
    },
    experiance:{
        type:String,
    },
    language:{
        type:String,
    },
    profession:{
        type:String,
    }

})
let user=mongoose.model("user",userschema)
export default user;