import React, { useState } from 'react'
import axios from 'axios'
import Navbar from "./assets/Navbar.jsx";
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import Login from "./pages/Login.jsx";
import CreateUser from "./pages/CreateUser.jsx";
import PasswordManager from  "./pages/PasswordManager.jsx"
import Home from "./pages/Home.jsx";

const Layout = () => (
    <>
        <Navbar />
        <Outlet />
    </>
);

const router = createBrowserRouter([
    {
        path: '/',  // Parent route
        element: <Layout />,
        children: [
            {
                path: '/',  // Default child route
                element: <Home />
            },
            {
                path: '/password',
                element: <PasswordManager />
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'register',
                element: <CreateUser />
            }
        ]
    }
]);

//https://dog.ceo/api/breeds/image/random
function App() {

  return (
    <div>
        <RouterProvider router={router} />
    </div>
  )

}

export default App
