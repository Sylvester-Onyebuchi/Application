const express = require('express')
const router = express.Router()
const USER = require('../db/user')
const bcrypt = require('bcryptjs')
const passport = require('../middleware/passport')
const TASK = require('../db/task.js')
router.get("/register", notAuthenticate, (req, res) => {
    res.render("register", {message:req.flash()});
})
router.get("/", notAuthenticate, (req, res) => {
    res.render("login", {message:req.flash()});
})
router.get("/home", authenticate,  async(req, res) => {
    const tasks = await TASK.find({ userId: req.user._id })
    res.render("home", {tasks,user: req.user.name});
})
router.get("/task", authenticate, (req, res) => {
    res.render("task");
})

router.post("/register", async(req,res) => {
    const {name, email,password, confirmPassword} = req.body

    const user = await USER.findOne({email})
    if(user){
        req.flash('error','A user with such email exist already')
        return res.redirect("/")
    }
    if(password != confirmPassword ){
        req.flash('error', 'passwords does not match!')
        return res.redirect("/register")
    }
    const genSalt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, genSalt)

   const newUser = new USER({
        name: name,
        email: email,
        password: hashPassword
   })

   await newUser.save()
   req.flash('success', 'You are now registered and can log in');
   res.redirect('/');
})

router.post("/",(req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    })(req,res,next)
});

router.post("/add-task", async(req,res,next) => {
   const task = new TASK({
    taskName: req.body.taskName,
    userId: req.user._id
   })
   await task.save()
   res.redirect("/home")
})

router.post("/update-task/:id", async(req,res) => {
    const task = await TASK.findById(req.params.id)
    task.completed = !task.completed
    await task.save()
    res.redirect("/home")
})

router.post("/delete-task/:id", async(req,res) => {
    await TASK.findByIdAndDelete(req.params.id)
    res.redirect("/home")
})
 
 function authenticate(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    req.flash('error', 'Please login to view tasks')
    res.redirect('/')
}

function notAuthenticate(req,res,next){
    if(req.isAuthenticated()){
        res.redirect("/home")
    }
    next()
}
router.get("/logout", (req,res,next) => {
    req.logout((err) => {
        if(err){return next(err)}
        res.redirect("/")
    })
})

module.exports = router;


