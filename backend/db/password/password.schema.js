const Schema = require('mongoose').Schema;

exports.PasswordSchema = new Schema({
    url: String,
    password:String,
    username: String,
}, { collection : 'myPasswordSpr2024' });

