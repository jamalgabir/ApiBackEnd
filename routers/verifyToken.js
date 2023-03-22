const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next) =>{
   const authoHeaher = req.heahers?.token;
   if(authoHeaher){
    const token = authoHeaher.split(" ")[1];
    jwt.verify(token,process.env.JWT_SEC, (error,user) =>{
        if(error) res.status(403).json({message:"token is not valide!"})
        req.user = user;
        next();
    })
   }
   else{
    return res.status(401).json({message:"you are not authenticated!"})
   }
};
const verifyTokenAndAuthorization = (req,res,next)=>{

    verifyToken(req,res, ()=>{

        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else{
            res.status(403).json({message:"you are not allowed to change!"})
        }
    })
};
const verifyTokenAndAdmin = (req,res,next)=>{
    verifyToken(req,res, ()=>{
        if(req.user.isAdmin){
            next();
        }else{
            res.status(403).json("you are not the admin.!")
        }
    })
}

module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
};