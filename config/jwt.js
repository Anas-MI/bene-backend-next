const expressJwt        = require('express-jwt');
const db                = require('./database');
const User              = db.User;


module.exports = jwt;
function jwt() {
    const secret = process.env.SECRET || 'reactappecommerce';
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/users/register',
            '/css',
            '/js',
            '/users/login',
            '/users/logout',
            // '/users/check'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await User.findById(payload.sub).select('-hash');

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }
    done();
};