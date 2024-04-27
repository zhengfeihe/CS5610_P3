import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Header.jsx';
import "../style/PasswordManager.css"
import "../style/FriendRequest.css"
import * as url from "url";
import SharedPasswordComponent from "../assets/SharedPasswordComponent.jsx";
import SendRequest from "../assets/SendRequest.jsx";
import PasswordSearch from "../assets/PasswordSearch.jsx";


function SharedPasswords({friends}){
    if (!friends || friends.length === 0) {
        return <h1>No shared passwords</h1>;
    }
    return (
        <div>
            <ul>
                {friends.map((friend, index) => (
                    <SharedPasswordComponent key={index} username={friend} />
                ))}
            </ul>
        </div>
    );

}


function generatePassword(length, useAlphabets, useNumerals, useSymbols) {
    const alphabetChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numeralChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let validChars = '';
    if (useAlphabets) validChars += alphabetChars;
    if (useNumerals) validChars += numeralChars;
    if (useSymbols) validChars += symbolChars;
    console.log(validChars);
    if (!validChars) {
        throw new Error('At least one character type must be selected');
    }

    const randomIndexes = new Uint8Array(length);
    window.crypto.getRandomValues(randomIndexes);

    const password = Array.from(randomIndexes, byte => validChars[byte % validChars.length]);

    function insertCharacterSecurely(passwordArray, charSet) {
        const randomIndex = new Uint8Array(1);
        const randomCharIndex = new Uint8Array(1);

        window.crypto.getRandomValues(randomIndex);
        window.crypto.getRandomValues(randomCharIndex);

        const position = randomIndex[0] % passwordArray.length;
        const char = charSet[randomCharIndex[0] % charSet.length];

        passwordArray[position] = char;
    }

    if (useAlphabets) {
        insertCharacterSecurely(password, alphabetChars);
    }
    if (useNumerals) {
        insertCharacterSecurely(password, numeralChars);
    }
    if (useSymbols) {
        insertCharacterSecurely(password, symbolChars);
    }

    return password.join('');
}



export default function PasswordManager() {

    const [passwordSets, setPasswordSets] = useState([]);
    const [requests, setRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [length,setLength] = useState(0);
    const [alphabetCheck, setAlphabetCheck] = useState(false);
    const [numberCheck, setNumberCheck] = useState(false);
    const [symbolCheck, setSymbolCheck] = useState(false);
    const [inputError, setInputError] = useState("");


    const [passwordInput, setPasswordInput] = useState({
        url: '',
        password: '',
    });

    async function getAllPassword() {
        const response = await axios.get('api/password/assets');
        setPasswordSets(response.data);
    }

    async function getUserInfo() {
        const response = await axios.get('/api/users/current');
        setRequests(response.data.requests);
        setFriends(response.data.friends);
    }

    useEffect(() => {
        getAllPassword();
    }, []);

    useEffect(() => {
        getUserInfo(); // Fetch on component mount

        const interval = setInterval(getUserInfo, 1000000); // Fetch every 100 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);




    function setPasswordUrl(event) {
        const url = event.target.value;
        setPasswordInput({
            ...passwordInput,
            url: url,
        })
    }

    function setPassword(event) {
        const password = event.target.value;
        setPasswordInput({
            ...passwordInput,
            password: password,
        })
    }

    function setPasswordLength(event) {
        const len = event.target.value;
        setLength(Number(len));
    }

    function changeAlphabetCheck(){
        setAlphabetCheck(!alphabetCheck);
    }

    function changeNumberCheck(){
        setNumberCheck(!numberCheck);
    }

    function changeSymbolCheck(){
        setSymbolCheck(!symbolCheck);
    }

    function FriendRequest(props) {
        const {username} = props;
        const [acceptClick, setAcceptClick] = useState(false);
        const [denyClick, setDenyClick] = useState(false);

        async function acceptFriendRequest() {
            setAcceptClick(true);
            const response = await axios.post('/api/users/acceptRequest', {sender: username});
            getUserInfo();
        }

        async function denyFriendRequest() {
            setDenyClick(true);
            const response = await axios.post('/api/users/denyRequest', {sender: username});
            getUserInfo();
        }

        return (
            <div className="friend-request">
                <ul>
                    <li>Name: {username}</li>
                    <li>
                        <button onClick={acceptFriendRequest} className={acceptClick ? 'button-clicked' : ''}>Accept
                        </button>
                    </li>
                    <li>
                        <button onClick={denyFriendRequest} className={denyClick ? 'button-clicked' : ''}>Deny</button>
                    </li>
                </ul>
            </div>
        );
    }

        function RequestList({requests}) {
            if (!requests || requests.length === 0) {
                return <h1>No requests</h1>;
            }

            return (
                <div>
                    <ul>
                        {requests.map((request, index) => (
                            <FriendRequest key={index} username={request}/>
                        ))}
                    </ul>
                </div>
            );
        }
    function OwnPassword({url, password}){
        const [showPassword, setShowPassword] = useState(false);
        function updatePassword(){
            setPasswordInput({
                ...passwordInput,
                url: url,
            });
        }
        async function deletePasswordPair(){
            const response = await axios.delete('/api/password/delete',{
                params: { url: url }
            });
            getAllPassword();
        }

        function togglePasswordVisibility() {
            setShowPassword(!showPassword);
        }

        function copyToClipboard() {
            navigator.clipboard.writeText(password);
        }
       return( <div className="password-row">
                <div>{url}</div>
                <div>{showPassword ? password : "************"} </div>
                <button onClick={togglePasswordVisibility}>{showPassword ? 'Hide Password' : 'Show Password'}</button>
                <button onClick={copyToClipboard}>Copy Password</button>
                <button onClick={updatePassword} >Update Password</button>
                <button onClick={deletePasswordPair} >Delete Password</button>
        </div>);
    }

    function OwnPasswordLists(){
        return (
            <div className="password-table">
                <div className="password-header">
                    <div>URL</div>
                    <div>Password</div>
                    <div></div>
                    <div>Copy Password</div>
                    <div>Update Password</div>
                    <div>Delete Password</div>
                </div>
                {passwordSets.map((passwordPair, index) => (
                    <OwnPassword
                        key={index}
                        url={passwordPair.url}
                        password={passwordPair.password}
                    />
                ))}
            </div>
        );
    }
    async function createNewPassword() {
        if(passwordInput.url === ""){
            setInputError("Please correctly input URL and Password!");
        }else{
            let newPassword = "";
            if(length>= 4 && length <= 50 && (alphabetCheck || symbolCheck || numberCheck)){
                newPassword  = generatePassword(length,alphabetCheck,numberCheck,symbolCheck);
            }
            if(newPassword === "" && passwordInput.password === ""){
                setInputError("Please correctly input URL and Password!");
            }else{
                if(newPassword!==""){
                    passwordInput.password= newPassword;
                }
                const response = await axios.post('/api/password/newpassword', passwordInput);
                setPasswordInput({
                    url: '', password: ''
                });
                setLength(0);
                await getAllPassword();
                setInputError("");
            }
        }
    }


    return (
        <div>
            <h2>Requests for sharing passwords</h2>
            <div className={"friend-request"}>
               <RequestList requests={requests}></RequestList>
            </div>
            <div className={"functional-areas"}>
                <PasswordSearch/>
                <SendRequest />
            </div>

            <h2>Password Input Area</h2>
            <div className={"password-input"}>
                {inputError && (
                    <h4 className="error-message">{inputError}</h4>
                )}                <ul>
                    <li>URL<input value={passwordInput.url} onInput={setPasswordUrl} type='text'></input></li>
                    <li>Password<input value={passwordInput.password} onInput={setPassword} type='text'></input></li>
                    <li>Length<input value={length} onInput={setPasswordLength} type='text'></input></li>
                    <label> <input type="checkbox" checked={alphabetCheck} onChange={changeAlphabetCheck}/> Alphabet</label>
                    <label> <input type="checkbox" checked={numberCheck} onChange={changeNumberCheck}/> Number</label>
                    <label> <input type="checkbox" checked={symbolCheck} onChange={changeSymbolCheck}/> Symbol</label>
                    <li><button onClick={createNewPassword} >Submit</button></li>
                </ul>
            </div>
            <h2>My Password Pairs</h2>
            <div className={"my password "}>
                <OwnPasswordLists />
            </div>
            <div className={'shared'}>
                <h2>Shared Passwords </h2>
                <SharedPasswords friends={friends}></SharedPasswords>
            </div>
        </div>
    )

}


