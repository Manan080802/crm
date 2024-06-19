const mongoose = require("mongoose")
const admin = mongoose.Schema({
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
    }
})

const admins = mongoose.model("admin", admin, "admin")
module.exports = admins