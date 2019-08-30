import React from 'react';
import { Link } from "react-router-dom";

import './Nav-bar.css';

const NavBar = ({ isOpen, close }) => (
    <>
        <nav className={`Nav-bar white ${isOpen ? 'Nav-bar--open' : ''} `}>
            <button className="btn-icon" onClick={close}>
                <img src={process.env.PUBLIC_URL + '/close-icon.svg'} alt="Close navigation" />
            </button>
            <ul className="Nav-bar__links reset-list">
                <li><Link to="/" onClick={close}>Lista de compras</Link></li>
                <li><Link to="/history" onClick={close}>Histórico de compras</Link></li>
            </ul>
        </nav>
        <span className="Nav-bar-overlay" onClick={close}></span>
    </>
);

export default NavBar
