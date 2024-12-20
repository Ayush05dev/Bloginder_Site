require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
const JWT = require('jsonwebtoken');


function createTokenForUser(user) {
    const payload={
        _id:user._id,
        fullName: user.fullName,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
        

    };
    const token = JWT.sign(payload, SECRET_KEY);  // we can also add expiration time of token
    return token;

}

function validateToken(token) {
        const payload = JWT.verify(token, SECRET_KEY);
        return payload;

}


module.exports = {
    createTokenForUser,
    validateToken
}