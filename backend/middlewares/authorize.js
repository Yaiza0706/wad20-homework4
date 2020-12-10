const UserModel = require('../models/UserModel');
const JWT = require('../library/jwt');

module.exports = (request, response, next) => {
    
    // This is the place where you will need to implement authorization
    /*
        Pass access token in the Authorization header and verify
        it here using 'jsonwebtoken' dependency. Then set request.currentUser as
        decoded user from access token.
    */

    if (request.headers.authorization) {

        token = request.headers.authorization.replace("Bearer ","")
        decoded = JWT.verifyAccessToken(token)
        console.log(token)
        UserModel.getById(decoded.id, (user) => {
            request.currentUser = user;
            next();
        });
    } else {
        // if there is no authorization header

        return response.status(403).json({
            message: 'Invalid token'
        });
    }
};