const mongoose = require("mongoose")

mongoose.connect("mongodb://crm:crm@127.0.0.1:27017/crm")
.then(() => console.log('DataBase is connected!'));    
module.exports = mongoose