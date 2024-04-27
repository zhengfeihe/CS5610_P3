const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken')
const {UserSchema} = require("../db/user/user.schema");
const UserModel = require('../db/user/user.model');


const userDB = [];

router.get('/', function(request, response) {
    response.send(userDB);
})

router.post('/', async function(request, response) {
    const body = request.body;

    const newUserResponse = await UserModel.createUser(body)
   
    response.send("Created new user!");
})

router.post('/login', async function(request, response) {
    const username = request.body.username;
    const password = request.body.password;

    try {
        const check = await UserModel.userExists(username);
        if(!check){
            return response.status(400).send("User doesn't exist, Please register firstly");
        }
        const createUserResponse = await UserModel.findUserByUsername(username)

        if (createUserResponse.password !== password) {
            return response.status(403).send("Invalid password")
        }

        const token = jwt.sign(username, "CS5610_PASSWORD")

        response.cookie("username", token);
        
        return response.send("User log in successfully")
    
    } catch (e) {
        console.log(e);
        response.status(401).send(null);
    }
})

router.post('/register', async function(request, response) {
    const username = request.body.username;
    const password = request.body.password;
    

    try {
        if(!username || !password) {
            return response.status(409).send("Missing username or password")
        }

        const createUserResponse = await UserModel.createUser({username: username, password: password});

        const token = jwt.sign(username, "CS5610_PASSWORD")

        response.cookie("username", token);
        
        return response.send("User created successfully")
    
    } catch (e) {
        console.log(e);
        response.status(401).send(e);
    }
})

router.get('/isLoggedIn', async function(request, response) {

    const username = request.cookies.username;

    if(!username) {
        return response.send({username: null})
    }
    let decryptedUsername;
    try {
        decryptedUsername = jwt.verify(username, "CS5610_PASSWORD")
    } catch(e) {
        return response.send({username: null})
    }

    if(!decryptedUsername) {

        return response.send({username: null})
    } else {
        return response.send({username: decryptedUsername})
    }
})

router.post('/logOut', async function(request, response) {

    response.cookie('username', '', {
        maxAge: 0,
    })

    response.send(true);

});

router.get('/current',async function (request, response){
    const username = request.cookies.username;

    if(!username) {
        return response.send("No current user!")
    }
    let decryptedUsername;
    try {
        decryptedUsername = jwt.verify(username, "CS5610_PASSWORD")
    } catch(e) {
        return response.send("No current user!")
    }

    if(!decryptedUsername) {
        return response.send("No current user!")
    } else {
        const userData = await UserModel.findUserByUsername(decryptedUsername);
        return response.send(userData);
    }
})

router.get('/:username', async function(request, response) {
    const username = request.params.username;

    const userData = await UserModel.findUserByUsername(username);

    return response.send(userData);
})


router.post('/sendRequest', async function(request,response){
    const sender = request.cookies.username;
    const {receiver} = request.body;

    let decryptedUsername;
    try {
        decryptedUsername = jwt.verify(sender, "CS5610_PASSWORD")
        const check = await UserModel.userExists(receiver);
        if(!check){
            return response.status(400).send("Error: Failed to send requests");
        }
        const sendRequestResponse = await UserModel.addRequest(decryptedUsername,receiver);
    } catch(e) {
        return response.status(400).send("Error: Failed to send requests");
    }
    return response.send("Successfully send requests!");
})

router.post('/acceptRequest', async function(request,response){
    const receiver = request.cookies.username;
    const {sender} = request.body;
    let decryptedUsername;

    try{
        decryptedUsername = jwt.verify(receiver, "CS5610_PASSWORD")

        const sendUserResponse = await UserModel.addUserFriend(sender,decryptedUsername);
        const receiveUserResponse = await UserModel.addUserFriend(decryptedUsername,sender);
        const deleteResponse = await  UserModel.deleteRequests(sender,decryptedUsername);
    }catch (error){
        response.status(400).send("Error: Failed to accept requests");
    }
    response.send("Successfully accept requests!");
})

router.post('/denyRequest', async function(request,response){
    const receiver = request.cookies.username;
    const {sender} = request.body;
    let decryptedUsername;
    try{
        decryptedUsername = jwt.verify(receiver, "CS5610_PASSWORD")
        const deleteResponse = await  UserModel.deleteRequests(sender,decryptedUsername);
    }catch (error){
        response.status(400).send("Error: Failed to deny requests");
    }
    response.send("Successfully deny requests!");
})

module.exports = router