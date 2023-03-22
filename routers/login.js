const router = require('express').Router();
const CryptoJS = require("crypto-js");
const User = require("../tables/user");
const jwt = require('jsonwebtoken');


router.post("/",async (req,res)=>{

   try{
    const user = await User.findOne({email:req.body.email.toLowerCase()});
    if(!user)
    return res.status(502).json({message:"this email not registred yet!"});

    const hashpass = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
    const originalPass = hashpass.toString(CryptoJS.enc.Utf8);
    if(originalPass !== req.body.password)
    return res.status(502).json({message: 'Wrong Password !'});
    
    const accessToken = jwt.sign(
        {id: user._id,isAdmin:true},
        process.env.JWT_SEC,
        {expiresIn:'1d'}

    );
    const {password,...data} = user._doc;
    res.status(200).json({...data,accessToken});
    }catch(error){
        console.log(error.stack)
        res.status(500).json({message:"somthing Wrong please try again letter"});

    }


})

module.exports = router;