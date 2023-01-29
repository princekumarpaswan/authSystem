require("dotenv").config()
require("./config/database").connect()
const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const cookieParser = require('cookie-parser')
// custom middle ware
const auth = require('./middleware/auth')

// import model - User
const User = require("./model/schema")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get("/", (req, res) => {
    res.send("hello auth System")
})

app.post("/registrer", async (req, res) => {
    try {
        // ollect all information
        const { firstName, lastName, email, password } = req.body
        // validate the data, if exixits
        if (!(email && password && lastName && firstName)) {
            res.status(401).send("All filds are required")
        }

        // check if user exists or not 
        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            res.status(401).send("User already found in database")
        }

        // encrypting  the password
        const myEncPassword = await bcrypt.hash(password, 10)

        // create a new entry in database
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: myEncPassword
        })

        // create a token and send it to user
        const token = jwt.sign({
            id: user._id, email: email
        }, "77777", { expiresIn: '2h' })


        user.token = token
        // dont want to send the password
        user.password = undefined

        res.status(201).json(user)


    } catch (error) {
        console.log(error + " error in response router");
    }
})

app.post("/login", async (req, res) => {
    try {
        // collect information from frontend
        const { email, password } = req.body
        // validate
        if (!(email && password)) {
            res.status(401).send("email and password required")
        }

        // check user i database
        const user = await User.findOne({ email })
        // match the passwords
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id, email }, "77777", { expiresIn: '2h' })
        }
        user.password = undefined
        user.token = token


        const options = {
            expire: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        }
        res.status(200).cookie("token", token, options).json({
            success: true,
            token,
            user
        })


        // create token and send
        res.sendStatus(400).send("email or password is incorrect")
    } catch (error) {

    }
})

app.get("/dashboard", (req, auth, res) => {
    res.send("Welcome to dashboard")
})