import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import feedback from '../Models/feedback.js';
import user from '../Models/userschema.js';
import { uplode } from '../multer.js';
import addpro from '../Models/addpro.js';
import mongoose from 'mongoose';

const register = async (req, res) => {
  try {
    const existingUser = await user.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userData = { ...req.body, password: hashedPassword };

    const newUser = new user(userData);
    const savedUser = await newUser.save();

    return res.status(201).json({ message: "User registered successfully", savedUser });
  } catch (error) {
    console.error("Error during registration:", error.message);
    return res.status(500).json({ message: "Error during registration" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const response = await user.findOne({ email });
    if (!response) {
      return res.status(400).json({ message: "User not found" });
    }

    const matchedpassword = await bcrypt.compare(password, response.password);
    if (!matchedpassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: response._id, email: response.email },
      "abc",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      _id: response._id,
      usertype: response.usertype,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


const profile=async(req,res)=>{
  try{
    const id=req.params.id;
    const response=await user.findById(id)
    res.json(response)
  }catch(error){
    res.status(500).json({message:"Erorr fetching user"})
  }
}
const updateuser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedata = { ...req.body };

    if (updatedata.password?.trim() === "") {
      delete updatedata.password; 
    } else if (updatedata.password) {
      updatedata.password = await bcrypt.hash(updatedata.password, 10);
    }

    const updateduser = await user.findByIdAndUpdate(id, updatedata, {
      new: true,
    });

    if (!updateduser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updateduser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

const userlist= async (req,res)=>{
  try{
    const id=req.params.id;
    const response= await user.find()
    res.json(response);
  }catch(error){
    res.status(500).json({message:"Error fetching user "})
  }
};

const feedsubmit=async(req,res)=>{
  try{
    const {feedcondent,userId}=req.body;
    console.log("Feedback submit userId:",userId);
    const newfeedbk=new feedback({userId,feedcondent})
    const savefd=await newfeedbk.save();
    res.json(savefd)    
  }catch(error){
    res.status(500).json({message:"Error in submitingv in feedback",error})
  }
}
  
const feedviwe=async(req,res)=>{
  try{
    const feeedbck=await feedback.find().populate("userId","name")
    const respodata=feeedbck.map((f)=>({
      feedcondent:f.feedcondent,
      createdAt:f.createdAt,
      user:{
         name:f.userId?.name || "Anonymos", 
      },
    }))
    res.json(respodata)
  }catch(error){
    res.status(500).json({massage:"Error on Fetching feedback",error})
  }
}
const updateagent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedata = { ...req.body };

    if (updatedata.password?.trim() === "") {
      delete updatedata.password;
    } else if (updatedata.password) {
      updatedata.password = await bcrypt.hash(updatedata.password, 10);
    }

    if (req.file) {
      updatedata.profileImage = `/uploads/${req.file.filename}`;
    }

    const updatedagent = await user.findByIdAndUpdate(id, updatedata, {
      new: true,
    });

    if (!updatedagent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json(updatedagent);
  } catch (error) {
    res.status(500).json({ message: "Error updating agent", error });
  }
};

const Agentprofile=async(req,res)=>{
  try{
    const id=req.params.id;
    const response=await user.findById(id)
    res.json(response)
  }catch(error){
    res.status(500).json({message:"Erorr fetching user"})
  }
}
const addproperty = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Property image required" });
    }

    const property = new addpro({
      ...req.body,
      image: `/uploads/${req.file.filename}`,
      agentId: req.user.userId, // from JWT middleware
    });

    await property.save();

    res.status(201).json({
      message: "Property added successfully",
      property,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding property", error });
  }
};  
const getAgentProperties = async (req, res) => {
  try {
    const agentId = req.user.userId;

    const properties = await addpro.find({ agentId });

    res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching agent properties:", error);
    res.status(500).json({ message: "Error fetching agent properties" });
  }
};

 const allProperties = async (req, res) => {
  try {
    const properties = await addpro.find(); 
    res.status(200).json(properties);
  } catch (error) {
    console.error("ALL PROPERTIES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch properties" });
  }
};


const buyproperty = async (req, res) => {
  const { id } = req.params;

  try {
   
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const property = await addpro.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export { register,login,profile,updateuser,userlist,feedsubmit,feedviwe,updateagent,Agentprofile,addproperty,getAgentProperties,allProperties,buyproperty};