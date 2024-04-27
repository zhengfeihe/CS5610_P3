import React, { useState } from 'react';
import axios from 'axios';
import "../style/SendRequest.css"

export default function PasswordSearch() {
    const [url, setUrl] = useState('');
    const [password,setPassword] = useState('');
    const [error, setError] = useState("");
    const [isButtonClicked, setIsButtonClicked] = useState(false);  // State to manage button click style

    async function searchPassword() {
        setIsButtonClicked(true);  // Set button click style
        try {
            const response = await axios.get('/api/password/search', {
             params:   { url: url }
            });
            if(response.status === 200){
                setPassword(response.data[0].password);
                setError("");
            }else{
                setError(response.data);
            }
        } catch (error) {
            setError("Request Invalid!");
            setPassword("");
        }
        setIsButtonClicked(false);  // Reset button click style
    }

    return (
        <div className="send-request">
            <h2>Search for target password</h2>
            { error&& (
                <h4 className="error-message">{error}</h4>
            )}
            <ul>
                <li>URL:<input value={url} onInput={e => setUrl(e.target.value)} type='text' /></li>
                <li><button onClick={searchPassword} className={isButtonClicked ? 'button-clicked' : ''}>Search</button></li>
               <li> {password && (
                    <li>Password: <strong>{password}</strong></li>  // Conditionally render password field
                )}</li>
               </ul>
        </div>
    );
}
