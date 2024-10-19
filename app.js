const express = require('express')
const session = require('express-session')
const flash = require('express-flash')
const mongoose = require('mongoose')
const path = require('path')
const passport = require('./middleware/passport')
const mongoStore = require('connect-mongo')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000
mongoose.connect(process.env.MONGO_DB || "mongodb://localhost:27017/TODO")
.then(() => console.log("Database connected successfully"))
.catch(err => {console.log(err)})
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    secret:process.env.SECRET || 'Todo-App',
    store: mongoStore.create({mongoUrl:'mongodb://localhost:27017/TODO', collectionName:'session'}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 2 * 24 * 60 * 60 * 1000}
}))
app.use(express.urlencoded({extended:true}))
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.set('view engine', 'ejs')

const router = require('./middleware/routes')
app.use("/", router)

app.listen(port, ()=>console.log(`App hosting on port ${port}`))

