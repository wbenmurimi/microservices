const express     = require('express');
const router      =  new express.Router()
const Order       = require('../models/order')
const {ObjectID}  = require('mongodb')
const axios = require('axios');

//Function to check is user is authenticated fro the users service
async function checkAuthenticationStatus(token,res) {
    
    try {
        console.log("AUTHENTICATE API : "+Date.now()/1000)
        let res = await axios.post('http://localhost:3000/api/users/checkauth', {
            token: token,
        })
        if(res.status == 200){
            console.log("AUTHENTICATE API RESIULT: "+Date.now()/1000)
        }    
        // Returning authenticated user  
        return res.data
    }
    catch (err) {
        // console.error(err);
        if(err.status == 401){
            // console.log(res)
            // console.log("************")
        } 
        return err;
    }
}

//Get a product given an id
async function getProductInfo(id,res) {
    
    try {
        console.log("CALLING PRODUCT API : ")
        let res = await axios.get('http://localhost:3001/api/products/details/'+id)
        if(res.status == 200){
            console.log("PRODUCT API RESIULT: "+Date.now()/1000)
        }    
        // Returning the product  
        return res.data
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
router.post('/',async (req,res) => {
    let token="";
    try{
        token= req.header('Authorization').replace('Bearer', '').trim()

        checkAuthenticationStatus(token, res).then(async function (result){
            if(result.message =='ok'){
                const order =  new Order({
                    ...req.body,
                    createdBy: result.user._id
                })
                console.log(order)

                try {
                    await order.save()
                    res.status(201).send({message:"Order created succesfully"})
                } catch (error) {
                    res.status(400).send(error)
                }
            }
            else{
                console.log("failed")
                res.status(401).send({error:'Not authorized to access this resource'})       
            }
        });
    } catch (error) {
        res.status(401).send({error:'Not authorized to access this resource'})
    }
})

//Get all orders that belong to a user
router.get('/',async (req,res) => {
    let token="";
    var ordersArray = [];
    try{
        token= req.header('Authorization').replace('Bearer', '').trim()

        checkAuthenticationStatus(token, res).then(async function (result){
            if(result.message =='ok'){
                // console.log(result.user._id)
                try {
                    const orders = await Order.find({createdBy: result.user._id})
                    orders.forEach(element => {
                        var oneOrder = {};
                        // calling the product service
                        getProductInfo(element.product,res).then(async function (rst){
                            oneOrder["createdBy"]= element.createdBy;
                            oneOrder["productName"]= rst.products.name;
                            oneOrder["productCost"]= rst.products.cost;
                            oneOrder["createdAt"]= element.createdAt;
                            // console.log(oneOrder)
                            ordersArray.push(oneOrder);                            
                        });    
                    }); 
                    
                    setTimeout(function(){
                        // console.log("O: "+ordersArray);
                        res.send({"orders":ordersArray})
                    }, 2000)              
                } catch (error) {
                    res.status(500).send()
                }
            }
            else{
                console.log("failed")
                res.status(401).send({error:'Not authorized to access this resource'})       
            }
        });
    } catch (error) {
        res.status(401).send({error:'Not authorized to access this resource'})
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