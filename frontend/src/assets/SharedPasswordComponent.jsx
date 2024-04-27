import React, {useState,useEffect} from "react";
import axios from "axios";

function PasswordsElements({url, password}){

    const [showPassword, setShowPassword] = useState(false);

    function togglePasswordVisibility() {
        setShowPassword(!showPassword);
    }

    return( <div className="password-row">
        <div>{url}</div>
        <div>{showPassword ? password : "************"} </div>
        <button onClick={togglePasswordVisibility}>{showPassword ? 'Hide Password' : 'Show Password'}</button>
    </div>);
}

export default function SharedPasswordComponent(props){
    const { username } = props
    const [passwordSets, setPasswordSets] = useState([]);
    async function getPassword() {
        const passwordResponse = await axios.get('api/password/friend', {
            params: { username: username }
        });
        setPasswordSets(passwordResponse.data);
    }

    useEffect(() => {
        if (username) {
            getPassword();
        }
    }, [username]);
    return (
        <div className={'shared-password-component'}>
            <h3>Username: {username}</h3>
        <div className="password-table">
            <div className="password-header">
                <div>URL</div>
                <div>Password</div>
            </div>
            {passwordSets.map((passwordPair, index) => (
                <PasswordsElements
                    key={index}
                    url={passwordPair.url}
                    password={passwordPair.password}
                />
            ))}
        </div>
        </div>
    );
}

