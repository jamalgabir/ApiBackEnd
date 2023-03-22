const router = require("express").Router();
const Product = require("../tables/products");
//GET ALL PRODUCTS
router.get('/', async (req, res) =>{
    const qnew = req.query.new;
    const qcategory = req.query.category;

    // let headercookie = req.headers.cookie;
    // if(typeof headercookie !== 'string'){
    //     headercookie = '';
    //     console.log(headercookie)
    // }
    // const cookie2 = cookie.parse(headercookie);
 
    //const bearer = cookie2;
    //console.log(cookie2)
    try{
      let products;
      if(qnew){
          products = await Product.find().sort({createdAt: -1}).limit(1);
      }else if(qcategory){
          products = await Product.find({
              categories: {
                  $in: [qcategory],
              }
          });
      }else{
          products = await Product.find();
      }
      
       res.status(200).json(products);
    }catch(err){
        res.status(500).json(err);
    }
});
//post product
router.post("/", async (req,res) =>{
    const newProduct = new Product(req.body);

    try{
        const saveProduct = await newProduct.save();
        res.status(201).json({newProduct})

    }catch(error){
        console.log(error)
        res.status(500).json({message:"enable to post products now please try again letter!"});

    }
})
//GET PRODUCT BY ID
router.get('/find/:id', async (req, res) =>{
    try{
      const product = await Product.findById(req.params.id);
      
       res.status(200).json({product})
    }catch(err){
        res.status(500).json("some error in the get products")
    }
});
//UPDATE PRODUCT
router.put('/:id', async (req,res) =>{
    
    try{

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,{
            $set: req.body
        },
        {
            new: true
        }
        );
        res.status(200).json(updatedProduct);
    }
    catch(err){
        res.status(500).json(err)
    }

});
//DELETE PRODUCT
router.delete('/:id', async (req, res) =>{
    try{
       await Product.findByIdAndDelete(req.params.id)
       res.status(200).json('the product has ben deleted!');
    }catch(err){
        res.status(500).json("you cant do that my you are not the admin")
    }
});


module.exports = router;