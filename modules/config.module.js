var jwtsecret = "redcarpetsolutions"

setJwtSecret = (secret) => {
    jwtsecret = secret;
}

module.exports.jwtsecret = jwtsecret;