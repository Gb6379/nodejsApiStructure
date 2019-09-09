const jwt = require('jsonwebtoken');
const variables = require('../bin/configuration/variables');

module.exports = async (req, res, next) => {
    let token = req.body.token || req.query.query || req.headers['x-access-token'];
    if(token){
        try {
            let decoded = await jwt.verify(token, variables.Security.secretKey);
            console.log(decoded);
            next();
        } catch (error) {
            res.status(401).send({message: 'The provide Token is Invalid'})
        }
    } else {
        res.status(401).send({message: 'You need to inform a token to acces this resource'});
        return
    }
}