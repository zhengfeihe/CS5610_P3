import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import "../style/login.css"

export default function Login() {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

    const [error, setErrorValue] = useState('');
    const navigate = useNavigate();

    function setUsername(event) {
        const username = event.target.value;
        setUsernameInput(username);
    }

    function setPassword(event) {
        const pswd = event.target.value;
        setPasswordInput(pswd);
    }

    async function submit() {
        setErrorValue('');
        try {
            const response = await axios.post('/api/users/login', {username: usernameInput, password: passwordInput})
            if(response.status === 200){
                navigate('/password');
            }else{
                setErrorValue(response.data);
            }
        } catch (e) {
            setErrorValue(e.response.data)
        }

        // console.log(usernameInput, passwordInput);
    }

    return (
        <div className="login-container">
            <h1>Login</h1>
            {!!error && <h2 className="error-message">{error}</h2>}
            <div className="login-field">
                <span>Username: </span><input type='text' value={usernameInput} onInput={setUsername} />
            </div>
            <div className="login-field">
                <span>Password: </span><input type='text' value={passwordInput} onInput={setPassword} />
            </div>
            <button className="login-button" onClick={submit}>Create Account/Login</button>
        </div>
    );


}