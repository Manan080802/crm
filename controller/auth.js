const passport = require("passport")
const LocalStrategy = require("passport-local")
const customer = require('../database/customer')
const md5 = require("md5")
const admin = require("../database/admin")

module.exports.auth = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());


    passport.use("customer", new LocalStrategy(
      
        async function (username, password, done) {
           
            password = md5(password)
            const datas = await customer.findOne({ username: username, password: password ,isactive:true })
            
            if (datas == null)
            {
                return done(null,false,{message:"username and password id not matched"})    
            }
            else
            {
                return done(null,datas)    
            }
             


        }

    ));

    passport.use("admin", new LocalStrategy(
      
        async function (username, password, done) {
            console.log(username)
            console.log(password)
            password = md5(password)
            console.log(password)
            const datas = await admin.findOne({ username: username, password: password })
            console.log(datas)
            if (datas == null)
            {
                return done(null,false,{message:"username and password id not matched"})    
            }
            else
            {
                return done(null,datas)    
            }
             


        }
    ));
    passport.serializeUser(function (datas, done) {
        // console.log(_id)
        done(null, datas); 
    });

    passport.deserializeUser(async function (datas, done) {
        // console.log(_id)
        // const datas = await customer.findById(_id)
        done(null, datas);
    });

}