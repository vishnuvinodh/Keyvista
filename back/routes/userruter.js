import express from "express";
import { addproperty, Agentprofile, allProperties, buyproperty, feedsubmit, feedviwe, getAgentProperties,login, profile, register, updateagent, updateuser, userlist } from "../controller/usercontroller.js"; 
import { uplode } from "../multer.js";
import verifyToken from "../middleware.js";


const userrouter = express.Router();

userrouter.post("/register", register);
userrouter.post("/login",login)
userrouter.get("/profile/:id",profile)
userrouter.put("/updateuser/:id",updateuser)
userrouter.get("/userlist",userlist)
userrouter.post("/feedsubmit",feedsubmit)
userrouter.get("/feedviwe",feedviwe)
userrouter.put("/updateagent/:id", uplode.single("profileImage"), updateagent);
userrouter.get("/Agentprofile/:id",Agentprofile)
userrouter.post("/addproperty",verifyToken,uplode.single("image"),addproperty);
userrouter.get( "/properties", verifyToken, getAgentProperties);
userrouter.get("/allproperties", allProperties);
userrouter.get("/property/:id", buyproperty);


export default userrouter;
