import React from 'react';
import { Link } from "react-router-dom";

import './Nav-bar.css';
import { useAuth } from '../../context/auth-context'

function NavBar({ isOpen, close }) {
    const { logout } = useAuth()

    return (
        <nav className={`Nav-bar white ${isOpen ? 'Nav-bar--open' : ''} `}>
            <ul className="Nav-bar__links reset-list">
                <li><Link to="/" onClick={close}>Lista</Link></li>
                <li><Link to="/history" onClick={close}>Histórico</Link></li>
                <li><Link to="/history" onClick={close}>Minha Conta</Link></li>
                <li><button onClick={logout}>Sair</button></li>
            </ul>
        </nav>
    )
}


export default NavBar
