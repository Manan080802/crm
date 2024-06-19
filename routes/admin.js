var express = require('express');
var router = express.Router();
const passport = require("passport");
const customers = require('../database/customer');
const { body } = require('express-validator');
const { validationResult } = require('express-validator');
const admin = require("../database/admin")
const { Types } = require('mongoose');
const { log } = require('handlebars');
const md5 = require("md5");
const admins = require('../database/admin');

/* GET users listing. */
async function ensureAuthenticatedLogin(req, res, next) {
    if (!req.isAuthenticated() || req.user==undefined) {
        console.log("***********************",req.user)
        return next();
        // return res.redirect('/customer/profile');
    }
    else
    {
        let datas = await admin.findById(req.user._id)
        console.log(datas)
        if (datas == null)
        {
            return next();
        }
        else
        {
            
            return res.redirect('/admin/home');
        }
        
    }
}
router.get('/login', ensureAuthenticatedLogin, function (req, res, next) {
    res.render('adminlogin', { messages: req.flash('error') })
});

router.post('/login', (req, res, next) => {
    passport.authenticate('admin', (error, user, info) => {
        if (error) {
            return next(error)
        }
        if (!user) {
            req.flash('error', 'Username or password is not matched')

            return res.redirect('/admin/login')
        }
        req.logIn(user, (error) => {
            if (error) {
                return next(error)
            }
            return res.redirect('/admin/home')
        })
    })(req, res, next)
})

async function ensureAuthenticated(req, res, next) {
    if (req.user == undefined) {
        return res.redirect('/admin/login');
    }
    else {
        
        
        const datas = await admin.findById(req.user._id)
    
        console.log(req.user)
        if (!req.isAuthenticated() || datas == null) {
            return res.redirect('/admin/login');
        
        }
        else {
            return next()
        }
    }
    // return next();

    // if (req.isAuthenticated()) {
    //     return next();
    // }
}

router.get("/home", ensureAuthenticated, async (req, res, next) => {
    const customer = await customers.find()
    const adminData = req.user
    res.render('adminhome', { customer, adminData })
})

router.get("/updatecustomer/:id/:isactive", async (req, res) => {
   
    let id = req.params.id
    let isactive = req.params.isactive
    if (isactive == "true") {
     
        let datas = await customers.updateOne({ "_id": new Types.ObjectId(id) }, { $set: { "isactive": false } })
        return res.redirect("/admin/home")
    }
    else {
       
        let datas = await customers.updateOne({ "_id": new Types.ObjectId(id) }, { $set: { "isactive": true } })
            return res.redirect("/admin/home")
    }
  
})

router.get("/addadmin", ensureAuthenticated, async (req, res) => {
    res.render('addadmin', { messages: req.flash('info') })

})

router.post('/register', registrationValidation = [

    body('password').isStrongPassword().withMessage('Password must be strong'),
    body('username').isEmail().withMessage('email is not written'),
    body('name').notEmpty().withMessage('Last name is required'),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            req.flash('info', 'Username or password or name is something wrong')
            return res.redirect('/admin/addadmin');

        }
        next()
    }
], async (req, res, next) => {



    try {
        const data = req.body
        
        data.password = md5(req.body.password)
       


        const datas = await admin.create(data)
       
        res.redirect('/admin/home')


    }
    catch (error) {
        req.flash('info', 'Email is already existing')
        return res.redirect('/admin/addadmin');

    }


})
router.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }

        res.redirect('/admin/login');
    });
})

router.get("/showadmin",ensureAuthenticated ,async (req, res) => {
    const admin = await admins.find()
    res.render("showadmin",{admin})
    
})



module.exports = router;
