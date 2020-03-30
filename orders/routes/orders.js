const express     = require('express');
const router      =  new express.Router()
const Order       = require('../models/order')
const Product     = require('../models/product')
let auth          = require('../middleware/auth');
const {ObjectID}  = require('mongodb')

//Get a product given an id
async function getProductInfo(id,res) {
    
    try {
        const product = await Product.findOne({ _id:id})
        if(!product){
            return res.status(404).send({error:"Product not found"})
        }
        // Returning the product  
        return product;
    }
    catch (err) {
        // console.error(err);
        if(err.status == 401){
            // console.log(res)
            console.log("************")
        } 
        return err;
    }
}


//Create a order
router.post('/',auth,async (req,res) => {

    const order =  new Order({
        ...req.body,
        createdBy: req.user._id
    })
    console.log(order)

    try {
        await order.save()
        res.status(201).send({message:"Order created succesfully"})
    } catch (error) {
        res.status(400).send(error)
    }

})

//Get all orders that belong to a user
router.get('/',auth,async (req,res) => {

    var ordersArray = [];
    try {
        const orders = await Order.find({createdBy: req.user._id})
        orders.forEach(element => {
            var oneOrder = {};
            // calling the product service
            getProductInfo(element.product).then(async function (rst,res ){

                oneOrder["createdBy"]= element.createdBy;
                oneOrder["productName"]= rst.name;
                oneOrder["productCost"]= rst.cost;
                oneOrder["createdAt"]= element.createdAt;

                ordersArray.push(oneOrder);                            
            });    
        })
        setTimeout(function(){
            // console.log("O: "+ordersArray);
            res.send({"orders":ordersArray})
        }, 3000)              
    } catch (error) {
        res.status(500).send()
    }
})

//Get a order that belongs to a user given the id of the order
router.get('/:id', async (req,res) => {
    const _id =  req.params.id
    if (!ObjectID.isValid(_id)) {
        return res.status(404).send({error:"Invalid parameter"});
    }
    try {
        const order = await Order.findOne({ _id:_id, createdBy: req.user._id })
        if(!order){
            return res.status(404).send({error:"Order not found"})
        }
        res.send({"orders":order});
    } catch (error) {
        res.status(500).send()
    }
})


module.exports = router