const User = require('../tables/user');

const {verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

const router = require('express').Router();

//UPDATE USER
router.put('/user/:id',verifyTokenAndAdmin, async (req,res) =>{
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString();
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set: req.body
        },
        {
            new: true
        }
        );
        res.status(200).json(updatedUser);
    }
    catch(err){
        res.status(500).json(err)
    }

});

//DELET USER
router.delete('/user/:id',verifyTokenAndAdmin, async (req, res) =>{
    try{
       await User.findByIdAndDelete(req.params.id)
       res.status(200).json('the user has ben deleted!')
    }catch(err){
        res.status(500).json(err)
    }
});
//GET USER
router.get('/user/:id',verifyTokenAndAdmin, async (req, res) =>{
    try{
      const user = await User.findById(req.params.id)
      const{password, ...others} = user._doc;
       res.status(200).json(others)
    }catch(err){
        res.status(500).json("Something Wrong!!")
    }
});

//GET ALL THE USERS
router.get('/users',verifyTokenAndAdmin, async (req, res) =>{
    const query = req.query.new;
    try{
      const users = query
      ? await User.find().sort({_id: -1}).limit(1)
      : await User.find();
      
       res.status(200).json(users);
    }catch(err){
        res.status(500).json(err);
    }
});

//GET USER STATUS 
router.get('/users/status',verifyTokenAndAdmin,async (req,res) =>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1));

    try{
        const data = await User.aggregate([
            {$match: {createdAt: {$gte: lastYear}}},
            {
                $project: {
                    month: {$month: '$createdAt'}
                }
            },
            {
                $group: {
                    _id: '$month',
                    totale: {$sum: 1}
                }
            }
        ]);
        res.status(200).json({data})
    }catch(error){
        res.status(500).json(error)
    }
})



module.exports = router;