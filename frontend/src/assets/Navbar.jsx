import React, {useEffect, useState} from 'react';
import { Link , useLocation} from 'react-router-dom';
import "../style/Navbar.css"
import axios from "axios";

function Navbar() {

    const [activeUsername, setActiveUsername] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const location = useLocation();
    async function checkIfUserIsLoggedIn() {
        const response = await axios.get('/api/users/isLoggedIn')
        setActiveUsername(response.data.username);
    }

    useEffect(() => {
        checkIfUserIsLoggedIn();
        if(activeUsername!==null){
            setIsLoggedIn(true);
        }
    }, [location]);

    async function logOutUser() {
        await axios.post('/api/users/logOut')
        setActiveUsername(null);
        setIsLoggedIn(false);
    }

    return (

    <nav>
            <ul>
                <div className="group">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/password">Password Manager</Link></li>
                </div>
                <div className="group">
                    {isLoggedIn && activeUsername? (
                        <>
                            <li>Username: {activeUsername}</li>
                            <li><Link to="/login" onClick={logOutUser}>Logout</Link></li>
                        </>
                    ) : (
                        <>
                        <li><Link to="/login">Log In</Link></li>
                        <li><Link to="/register">Sign Up</Link></li>
                        </>
                    )
                    }
                </div>
            </ul>
        </nav>
    );
}


export default Navbar;
