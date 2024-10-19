const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const passport = require('passport')
const USER = require('../db/user.js')


passport.use(new LocalStrategy({usernameField: 'email'}, async(email, password, done) => {
    const user = await USER.findOne({email});
    if(!user){
        return done(null, false, {message: "user doesn't exist"})
   }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        return done(null, false, {message:'Incorret email or password'})
    }
    done(null, user)
}))

passport.serializeUser((user, done)=>{
    done(null, user.id)
})
passport.deserializeUser(async(id, done) => {
    try {
        const user = await USER.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
})

module.exports = passport