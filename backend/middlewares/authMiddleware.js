const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async(req,res,next)=>{
    try{
        let token = req.headers.authorization;
        if(!token || !token.startsWith("Bearer")){
            return res.status(401).json({message: "No token, authorization denied"});
        }
            token = token.split(" ")[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
    }catch(err){
        res.status(401).json({message: "token failed", error: err.message})

    }
}

// middleware for admin
const adminOnly =(req,res,next)=>{
    if(req.user && req.user.role =="admin"){
        next();
    }else{
        res.status(403).json({message: "access denied, admin only"})
    }
}
module.exports = {protect, adminOnly}