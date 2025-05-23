const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        const userExists = await User.findOne({email});
        console.log("User exists", userExists);
        if(userExists) return res.status(400).json({message: 'User already exists'});

        const hasedPassword = await bcrypt.hash(password, 10);

        const user = new User({name, email, password: hasedPassword});
        await user.save();

        res.status(201).json({message: "user registered successfully"});
    } catch(err){
        res.status(500).json({message:err.message})
    }
};

exports.login = async (req, res) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email});
        if(!user) return res.status(404).json({message: 'User not found'});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({message: 'Invalid credentials'});

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.json({token, user: {id:user._id, name:user.name}});
    } catch(err){
        res.status(500).json({message: err.message});
    }
};                                                              