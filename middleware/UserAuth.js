// grab models
const models = require('../models');
// data encryption
const jwt = require('jsonwebtoken');
// env vars
require('dotenv').config();

// helper obj
const UserAuth = {};

/* Call in any controller file by using:
        const UserAuth = require('../middleware/UserAuth');
    at the top of the file. Then call with:
        await UserAuth.authorizeUser(req.headers.authorization)
    to get back true (user exists) or false (user does not exist)
*/
UserAuth.authorizeUser = async (authId) =>
{
    try {
        // decrypt user id
        const decryptedId = jwt.verify(authId, process.env.JWT_SECRET);
        // grab user
        const user = await models.user.findOne({ where: { id: decryptedId.userId}});
        // grab user's home images
        const homeImages = await user.getHomeImages();
        // add images to user obj
        user.homeImages = homeImages;
        // return authorized user if it exists
        return user ? user : null;
    } catch (error) {
        return 'user authorization error';
    }
}

UserAuth.authorizeAdmin = async (authId) =>
{
    try {
        // decrypt user id
        const decryptedId = jwt.verify(authId, process.env.JWT_SECRET);
        // check if decrypted id is admin's id
        if (decryptedId.userId == process.env.ADMIN_ID)
        {
            // grab admin
            const admin = await models.user.findOne({ where: { id: decryptedId.userId }});
            // return authorized admin if it exists
            return admin ? admin : null;
        }
        // not admin
        else
        {
            return null;
        }
    } catch (error) {
        return 'admin authorization error';
    }
}

module.exports = UserAuth;