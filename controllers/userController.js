// imports
const models = require('../models');
const UserAuth = require('../middleware/UserAuth');

// controller obj
const userController = {};

// create user
userController.signup = async (req, res) =>
{
    try {
        const user = await models.user.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            modType: req.body.modType,
            modNum: req.body.modNum,
            modKW: req.body.modKW,
            modWattage: req.body.modWattage,
            inverter: req.body.inverter,
            powerwallNum: req.body.powerwallNum
        })
        // return new user
        res.json({ user: user.encrypted() });
    } catch (error) {
        console.log(error);
        if (error.message === 'Validation error: Validation isEmail on email failed')
        {
            // status 409 - conflict
            res.status(409).json({ error: 'email must be valid'});
        }
        else if (error.message === 'Validation error')
        {
            // status 409 - conflict
            res.status(409).json({ error: 'email already taken'});
        }
        else
        {
            // status 400 - bad request
            res.status(400).json({ error: error.message });
        }
    }
}

// user login
userController.login = async (req, res) =>
{
    try {
        // grab user by email
        const user = await models.user.findOne({ where: { email: req.body.email }});
        // check if user exists
        if (user)
        {
            // check if input password matches user's password
            if (user.verifyPassword(req.body.password))
            {
                // return logged in user
                res.json({ user: user.encrypted() });
            }
            else
            {
                // status 401 - unauthorized
                res.status(401).json({ error: 'incorrect password' });
            }            
        }
        // no user
        else
        {
            // status 404 - could not be found
            res.status(404).json({ error: 'incorrect email' });
        }
    } catch (error) {
        console.log(error);
        // status 400 - bad request
        res.status(400).json({ error: 'could not login user' });
    }
}

// get profile
userController.profile = async (req, res) =>
{
    try {
        // grab authorized user
        const user = await UserAuth.authorizeUser(req.headers.authorization);
        // check if user exists
        if (user)
        {
            // return user
            res.json({ user: user.encrypted() });
        }
        // no user
        else
        {
            // status 404 - could not be found
            res.status(404).json({ error: 'no profile found' });
        }
    } catch (error) {
        // status 400 - bad request
        res.status(400).json({ error: 'failed to get profile' });
    }
}

// update profile
userController.update = async (req, res) =>
{
    try {
        // grab authorized user
        const user = await UserAuth.authorizeUser(req.headers.authorization);
        // check if user exists
        if (user)
        {
            // try to grab user with input email
            const dupeUser = await models.user.findOne({ where: { email: req.body.email }});
            // check if user exists and is not current user
            if (dupeUser && req.body.email !== user.email)
            {
                throw 'duplicate emails';
            }
            // update user
            await user.update(req.body);
            // return user
            res.json({ user: user.encrypted() });
        }
        // no user
        else
        {
            // status 404 - could not be found
            res.status(404).json({ error: 'no profile found'});
        }
    } catch (error) {
        console.log(error);
        // check if error was dupe emails
        if (error === 'duplicate emails')
        {
            // status 409 - conflict
            res.status(409).json({ error: 'email already taken' });
        }
        else
        {
            // status 400 - bad request
            res.status(400).json({ error: 'failed to update profile'});
        }
    }
}

// verify user
userController.verify = async (req, res) =>
{
    try {
        // grab authorized user
        const user = await UserAuth.authorizeUser(req.headers.authorization);
        // check if user exists
        if (user) {
            // return verified user
            res.json({ user: user.encrypted() })
        }
        // no user
        else {
            // status 404 - could not be found
            res.status(404).json({ error: 'user not found' });
        }
    } catch (error) {
        console.log(error.message);
        // status 400 - bad request
        res.status(400).json({ error: 'could not verify user' });
    }
}


module.exports = userController;