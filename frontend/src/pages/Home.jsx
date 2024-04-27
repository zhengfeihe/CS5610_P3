import React from "react";
import "../style/Home.css"

export default function Home() {
    return(
        <div>
            <h1> Home Page</h1>
            <div className="paragraph-part">
                <h2>Password Manager</h2>
                <p>As more and more companies experience hacks and cybersecurity becomes more important, there are many services that can generate and manage passwords on your behalf. This is a password manager system, which can store your your
                    frequently used password & url pairs </p>
            </div>
            <div className="paragraph-part">
                <h2>Functions</h2>
                <ul>
                    <li>You can register/login to the system. Currently reset password is not supported</li>
                    <li>After you logged in, you will be directed to the password manager page.</li>
                    <li>You can add url& password pairs in the system, and if you don't want to think about password your self, you can generate a Cryptographically secure password based on your choice</li>
                    <li>You can also share password with other uses in the system by sending requests, once they accept the request, you can see each other's password on the page</li>
                    <li>If you have a lot of passwords, you can directly get your target password using the search option.</li>
                    <li>All of your data is securely store on the remote MongoDB server</li>
                </ul>

            </div>
            <div className="paragraph-part">
                <h2>Contributor</h2>
                <p>This app is developed by Zhengfei He</p>
            </div>
        </div>
    );
}