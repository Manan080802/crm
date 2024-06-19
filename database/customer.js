const mongoose = require("mongoose")
const customer = mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        trim:true
    },
    username: {
        type: String,
        lowercase:true,
        unique:true
    },
    password: {
        type:String
    },
    isactive:
    {
        type: Boolean,
        default:true
    }
})

const customers = mongoose.model("customer", customer, "customer")
module.exports = customers