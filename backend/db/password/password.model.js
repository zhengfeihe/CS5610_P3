const mongoose = require("mongoose")

const PasswordSchema = require('./password.schema').PasswordSchema;

const PasswordModel = mongoose.model("PasswordModel", PasswordSchema);

function createPassword(password) {
    return PasswordModel.create(password);
}

function returnAllPassword() {
    return PasswordModel.find().exec();
}

function findPasswordByUrl(url, username) {
    console.log(username)
    console.log(url);
    return PasswordModel.find({username: username, url: url}).exec();
}

function updatePasswordByUrl(newPasswordData) {
    return PasswordModel.findOneAndUpdate({url: newPasswordData.url, username: newPasswordData.username},
        {$set: {password: newPasswordData.password}},
        {new: true}).exec();
}

function findPasswordByUsername(username) {
    return PasswordModel.find({username: username}).exec();
}

function deletePassword(url, username) {
    return PasswordModel.deleteOne({url: url, }).exec();
}

function passwordPairExists(newPasswordData){
    return PasswordModel.findOne({ url: newPasswordData.url, username: newPasswordData.username })
        .then(document => {
            return document != null;
        })
        .catch(err => {
            return false;
        });
}

module.exports = {
    createPassword,
    deletePassword,
    returnAllPassword,
    updatePasswordByUrl,
    findPasswordByUsername,
    passwordPairExists,
    findPasswordByUrl,
}