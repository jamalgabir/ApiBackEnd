const router = require('express').Router();

const User = require("../tables/user")
const CriptoJS = require("crypto-js");



router.post("/",async (req, res)=>{
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    if(!firstname || !lastname || !email || !password)
    return res.status(400).json({message: "All fileds must be filled out !"})
    const oldUser = await User.findOne({email:email});
    if(oldUser)return res.status(500).json({message:"This email all ready exist!"});

    const newUser = new User({
        firstname:firstname,
        lastname:lastname,
        email:email,
        password: CriptoJS.AES.encrypt(password,process.env.PASS_SEC).toString()
    })
    try{
        const saveUser = await newUser.save();
        res.status(201).json({message:"successfully registred"})

    }catch(error){
        console.log(error)
        res.status(500).json({message:"Ops! something Wrong please try again letter!"})

    }
})

module.exports = router;
