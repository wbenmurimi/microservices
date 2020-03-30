const express = require("express")
const jwt = require('jsonwebtoken')
const router = express.Router();
let User = require('../models/user');
let auth = require('../middleware/auth');
const {ObjectID}  = require('mongodb')


router.route('/').get((req, res) => {
  User.find()
    .then(users => res.status(200).json({"user":users}))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Create a new user
router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        
        res.status(201).send({ message: 'User created succesfully'  })
        console.log("success")
    } catch (error) {
        console.log("401")
        res.status(401).send(error)
    }
})

//Login a registered user
router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send({ error: 'Invalid login credentials' })
        }
        const token = await user.generateAuthToken()
        res.send({ "user":user, token })
    } catch (error) {
        res.status(400).send(error)
    }
});

router.post('/logout', auth, async(req, res) => {
    // Log user out of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.status(200).send({ message: 'Logged out of all devices succesfully' })
    } catch (error) {
        res.status(500).send(error)
    }
});

// // Check if a user is authenticated
// router.post('/checkauth', async(req, res,next) => {
//     try {
//         const token = req.body.token
//         console.log("Token: "+token)
//         const decoded  = jwt.verify(token,  process.env.JWT_KEY)
//         const user  = await User.findOne({ _id:decoded._id, 'tokens.token': token})

//         if(!user){
//             throw new Error()
//         }
//         req.token = token
//         req.user = user
//         console.log("authenticated")
//         next()
//         res.status(200).send({"user":req.user,"message":"ok"});
//     } catch (error) {
//         console.log("######")
//         // console.log(error)
//         next()
//         res.status(401).send({error:'Not authorized to access this resource',"message":"no"})
//     }
    
// });

//Get user details given their id
router.get('/:id', auth, async (req,res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(404).send();
    }
    try {
        const user = await User.findOne({ _id: req.params.id })
        if(!user){
            return res.status(404).send()
        }
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send()
    }
});


module.exports = router;