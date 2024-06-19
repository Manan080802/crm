var express = require('express');
var router = express.Router();
const { body } = require('express-validator');
const { validationResult } = require('express-validator');
const md5 = require("md5")
const customer = require("../database/customer")

const passport = require("passport");
const { Types } = require('mongoose');
/* GET users listing. */

async function ensureAuthenticatedLogin(req, res, next) {
    if (!req.isAuthenticated() || req.user==undefined) {
        console.log("***********************",req.user)
        return next();
        // return res.redirect('/customer/profile');
    }
    else
    {
        let datas = await customer.findById(req.user._id)
        console.log(datas)
        if (datas == null)
        {
            return next();
        }
        else
        {
            
            return res.redirect('/customer/profile');
        }
        
    }
}
router.get('/login',ensureAuthenticatedLogin,function (req, res, next) {

    res.render('customerlogin',{ messages: req.flash('error') })
});

router.get('/register',ensureAuthenticatedLogin,(req, res, next) => {
    res.render('customerregister', { messages: req.flash('info') })

})

router.post('/register', registrationValidation = [

    body('password').isStrongPassword().withMessage('Password must be strong'),
    body('username').isEmail().withMessage('email is not written'),
    body('name').notEmpty().withMessage('Last name is required'),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            req.flash('info', 'Username or password or name is something wrong')
            return res.redirect('/customer/register');

        }
        next()
    }
], async (req, res, next) => {


    try {
        const data = req.body
        data.password = md5(req.body.password)
        const datas = await customer.create(data)
       
        req.logIn(datas, (error) => {
            if (error) {
                return next(error)
            }
            return res.redirect('/customer/profile')
        })


    }
    catch (error) {
        req.flash('info', 'Email is already existing')
        return res.redirect('/customer/register');

    }

})


router.post("/login", (req, res,next) => {
    passport.authenticate('customer', (error, user, info) => {
        if (error) {
            return next(error)
        }
        if (!user) {
            req.flash('error', 'Username or password is not matched')

            return res.redirect('/customer/login')
        }
        req.logIn(user, (error) => {
            if (error) {
                return next(error)
            }
            return res.redirect('/customer/profile')
        })
    })(req,res,next)
})

function ensureAuthenticated(req, res, next) {
    if (!req.isAuthenticated() || req.user.isactive==undefined ) {
        return res.redirect('/customer/login');
    }
    return next();
}


router.get('/profile', ensureAuthenticated, async (req, res) => {
    if (req.user == null)
    {
        return res.send('data is not found')    
    }
    else
    {
        
        let data = await customer.findById(req.user._id)
       return res.render('profile', { data ,messages: req.flash('info')})
    }
});

router.post("/updateData",registrationValidation = [

    body('password').isStrongPassword().withMessage('Password must be strong'),
    body('username').isEmail().withMessage('email is not written'),
    body('name').notEmpty().withMessage('Last name is required'),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            req.flash('info', 'Please enter the username name or  password')
            return res.redirect('/customer/profile');

        }
        next()
    }
] ,ensureAuthenticated,async (req, res) => {
    let datasforsession = req.user
    let dataforform = req.body
    dataforform.password = md5(dataforform.password)
    dataforform.isactive = true
    
    if (dataforform.name != datasforsession.name || dataforform.username == datasforsession.username && dataforform.password == datasforsession.password)
    {
        let data = await customer.findOneAndUpdate({ _id: new Types.ObjectId(datasforsession._id) }, dataforform)
        req.flash('info', 'updated Data...')
        res.redirect('/customer/profile')
        
        
    }
    else {
        let data = await customer.findOneAndUpdate({ _id: new Types.ObjectId(datasforsession._id) }, dataforform)
        req.logout(function (err) {
            if (err) { return next(err); }
            req.flash('error', 'You are changed Username and Password')
            res.redirect('/customer/login');
          });

        
    } 
    
   
    
})

router.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
       
        res.redirect('/customer/login');
      });
})




module.exports = router;
