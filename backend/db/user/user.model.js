const mongoose = require("mongoose")

const UserSchema = require('./user.schema').UserSchema;

const UserModel = mongoose.model("UserModel", UserSchema);

function createUser(user) {
    return UserModel.create(user);
}

function findUserByUsername(username) {
    return UserModel.findOne({username: username}).exec();
}

function addUserFriend(username, friendUsername) {
    return UserModel.findOneAndUpdate(
        {
            username: username,
            friends: { $ne: friendUsername }
        },
        {
            $push: { friends: friendUsername }
        },
        {
            new: true,
            runValidators: true
        }
    ).exec();
}

function deleteRequests(userSendRequest,userReceiveRequest) {
    return UserModel.findOneAndUpdate(
        { username: userReceiveRequest },
        { $pull: { requests: userSendRequest } },
        { new: true, runValidators: true }
    ).exec();
}

function userExists(username) {
    return UserModel.findOne({ username: username })
        .then(user => {
            if (user) {
                return true;
            } else {
                return false;
            }
        })
        .catch(err => {
            return false;
        });
}


function addRequest(userSendRequest, userReceiveRequest) {
    return UserModel.findOneAndUpdate(
        { username: userReceiveRequest },
        { $addToSet: { requests: userSendRequest } },
        { new: true, runValidators: true }
    ).exec();
}


module.exports = {
    createUser,
    findUserByUsername,
    addRequest,
    deleteRequests,
    addUserFriend,
    userExists,
}