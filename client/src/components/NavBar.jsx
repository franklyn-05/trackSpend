import { Outlet, NavLink } from "react-router-dom";
import { isLoggedIn, logout } from '../utils/auth';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NavBar() {

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        logout();
        navigate('/login');
    }



    return (
        <>
            <nav className="w-full">
                <div className="navbar rounded-b-3xl mb-5 bg-[#0a0a0a] shadow-sm">
                    <div className="navbar-start">
                        <NavLink className="nav-logo" to="/"><img className="nav-logo" src="/logo.jpg"></img></NavLink>
                    </div>
                    <div className="navbar-center">
                        <NavLink className="nav-elt" to="/">Home</NavLink>
                        {token ? (
                            <>
                                <NavLink className="nav-elt" to="/transactions">Transactions</NavLink>
                                <NavLink className="nav-elt" to="/budgets">Budgets</NavLink>
                            </>
                        ) : (
                            <NavLink className="nav-elt" to="/about-us">About</NavLink>
                        )}
                    </div>
                    <div className="navbar-end">
                        { token ? (
                            <>
                                <NavLink className="nav-elt" to="/profile">Profile</NavLink>
                                <button className="nav-elt cursor-pointer" onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <>
                                <NavLink className="nav-elt" to="/login">Login</NavLink>
                                <NavLink className="nav-elt" to="/register">Register</NavLink>
                            </>
                        )}
                    </div>
                </div>

            </nav>
            <Outlet />
        </>

    )
};