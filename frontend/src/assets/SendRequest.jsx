import React, { useState } from 'react';
import axios from 'axios';
import "../style/SendRequest.css"

export default function SendRequest() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState("");
    const [isButtonClicked, setIsButtonClicked] = useState(false);  // State to manage button click style

    async function sendFriendRequest() {
        setIsButtonClicked(true);  // Set button click style
        try {
            const response = await axios.post('/api/users/sendRequest', { receiver: username });
            if(response.status === 400){
                setError("Request Invalid!");
            }else{
                setError("");
            }
        } catch (error) {
            setError("Request Invalid!");
        }
        setIsButtonClicked(false);  // Reset button click style
    }

    return (
        <div className="send-request">
            <h2>Send Share Password Request</h2>
            { error&& (
                <h4 className="error-message">{error}</h4>
            )}
            <ul>
                <li>Username:<input value={username} onInput={e => setUsername(e.target.value)} type='text' /></li>
                <li><button onClick={sendFriendRequest} className={isButtonClicked ? 'button-clicked' : ''}>Send</button></li>
            </ul>
        </div>
    );
}
