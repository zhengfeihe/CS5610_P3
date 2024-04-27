const Schema = require('mongoose').Schema;

exports.UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    requests:{
        type: [String],
        require: false,
    },
    friends:{
        type: [String],
        require: false,
    },}, { collection : 'usersSpr2024' });

