const jwt = require("jsonwebtoken")




const auth = (req, res, next) => {
    const token = req.cookies.token

    // what if token is not there 
    if (!token) {
        return res.status(403).send("token is missing")
    }

    // veryfy token
    try {
        const decode = jwt.verify(token, "77777")
        console.log(decode);
        req.user = decode

        //   extract id from token and query the Db
    } catch (error) {
        return error
    }
    return next()
}

module.exports = auth