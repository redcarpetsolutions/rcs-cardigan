let jwtsecret = "redcarpetsolutions"

setJwtSecret = (secret) => {
    jwtsecret = secret;
}

module.exports.jwtsecret = jwtsecret;
module.exports.setJwtSecret = setJwtSecret;