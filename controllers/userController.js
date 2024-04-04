const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.signup = async (req, res) => {
    try {
        const { name, email, password, isAdmin } = req.body;

        //Check if user already exists
        let user = await User.findOne({email});
        console.log(user);
        if(user){
            return res.status(400).json({ msg: 'User already exists!'});
        };


        //Create new user
        user = new User({ name, email, password, isAdmin: isAdmin || false });

        //Encrypt passsword
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        //Return JWT token
        const payload = { user: {id:user.id}};
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:3600}, (err, token) => {
            if (err) throw err;
            res.json({token});
        });
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        //Check if user already exists
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({msg: 'Invalid credentials!'});
        };

        //Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({mas: 'Invalid credentials!'});
        }

        const payload = {user: {id: user.id}};
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:3600}, (err, token) => {
            if(err) throw err;
            res.json({token, id: user.id, name: user.name, isAdmin:user.isAdmin});
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
};