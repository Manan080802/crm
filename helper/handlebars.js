var Handlebars = require("handlebars")
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
var helpers = require('handlebars-helpers')({
    handlebars: Handlebars
})


let themeHelpers = {

    debug: function (value) {
        console.log(value);

    },

    


};

module.exports = {
    defaultLayout: 'default',
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: {
        ...helpers,
        ...themeHelpers

    }
}