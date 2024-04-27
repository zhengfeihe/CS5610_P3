const express = require('express')
const router = express.Router();
const PasswordModel = require('../db/password/password.model');
const jwt = require('jsonwebtoken')

router.get('/friend', function(request, response) {
    const username = request.query.username;
    if (!username) {
        return response.status(400).send("Username is required");
    }
    PasswordModel.findPasswordByUsername(username)
        .then(function(dbResponse) {
            response.send(dbResponse);
        })
        .catch(function(error) {
            response.status(500).send("Failed to get friend's data");
        });
});


router.get('/assets', function(request, response) {

    const username = request.cookies.username;

    let decryptedUsername;
    try {
        decryptedUsername = jwt.verify(username, "CS5610_PASSWORD")
    } catch(e) {
        return response.status(404).send("Invalid request")
    }
    PasswordModel.findPasswordByUsername(decryptedUsername)
        .then(function(dbResponse) {
            response.send(dbResponse)
        })
        .catch(function(error) {
            response.status(500).send(error)
        })
})


router.post('/newpassword', async function(request, response) {
    const newPassword = request.body;

    const username = request.cookies.username;

    let decryptedUsername;
    try {
        decryptedUsername = jwt.verify(username, "CS5610_PASSWORD")
    } catch(e) {
        return response.status(404).send("Invalid request")
    }

    newPassword.username = decryptedUsername;

    try {
        const  check = await PasswordModel.passwordPairExists(newPassword);
        if(!check){
            const createPasswordResponse = await PasswordModel.createPassword(newPassword)
            return response.send("Successfully Created: " + createPasswordResponse)
        }else{
            const updatePasswordResponse = await PasswordModel.updatePasswordByUrl(newPassword)
            return response.send("Successfully Updated: " + updatePasswordResponse)
        }
    } catch (error) {
        return response.status(500).send(error)
    }
})


router.get('/', function(req, res) {
    res.send("This is the the base password manager route")
})

router.get('/search', async function (request, response) {
    const url = request.query.url;

    const username = request.cookies.username;
    let decryptedUsername;
    try {
        decryptedUsername = jwt.verify(username, "CS5610_PASSWORD")
    } catch (e) {
        return response.status(404).send("Invalid request")
    }
    try {
        const searchResponse = await PasswordModel.findPasswordByUrl(url,decryptedUsername)
        if(searchResponse.data === null){
            return response.status(400).send("Url doesn't exists");
        }else{
            console.log(searchResponse);
            return response.send(searchResponse);
        }
    }catch (error) {
        return response.status(500).send(error)
    }
})

router.delete('/delete', async function(request, response) {
    const url = request.query.url;

    const username = request.cookies.username;
    let decryptedUsername;
    try {
        decryptedUsername = jwt.verify(username, "CS5610_PASSWORD")
    } catch (e) {
        return response.status(404).send("Invalid request")
    }
    try {
        const searchResponse = await PasswordModel.findPasswordByUrl(url,decryptedUsername)
        if(searchResponse.data === null){
            return response.status(400).send("Url doesn't exists");
        }else{
            const deleteResponse = await PasswordModel.deletePassword(url);
        }
    }catch (error) {
        return response.status(500).send(error)
    }
    return response.send("Successfully delete Password Pair!")
})

router.post('/', function(req, res) {
    res.send("This is how you'll create new password")
})

module.exports = router;