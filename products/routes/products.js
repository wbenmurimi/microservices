const express     = require('express');
const router      =  new express.Router()
const Product       = require('../models/product')
const {ObjectID}  = require('mongodb')

//Create a product
router.post('/',async (req,res) => {
    const product =  new Product({
        ...req.body
    })
    try {
        await product.save()
        res.status(201).send({message:"Product created succesfully"})
    } catch (error) {
        res.status(400).send(error)
    }
})
//Get all products
router.get('/',async (req,res) => {
    try {
        const products = await Product.find({})
        res.send({"products":products})
    } catch (error) {
        res.status(500).send()
    }
})

//Get a given product given the id of the product
router.get('/details/:id', async (req,res) => {
    const _id =  req.params.id
   
    if (!ObjectID.isValid(_id)) {
        return res.status(404).send({error:"Invalid parameter"});
    }
    try {
        const product = await Product.findOne({ _id})
        if(!product){
            return res.status(404).send({error:"Product not found"})
        }
        res.status(200).send({"products":product});
    } catch (error) {
        res.status(500).send()
    }
})


//Get a given product given the id of the product
router.get('/:id', async (req,res) => {
    const _id =  req.params.id
   
    if (!ObjectID.isValid(_id)) {
        return res.status(404).send({error:"Invalid parameter"});
    }
    try {
        const product = await Product.findOne({ _id})
        if(!product){
            return res.status(404).send({error:"Product not found"})
        }
        res.send({"products":product});
    } catch (error) {
        res.status(500).send()
    }
})


module.exports = router