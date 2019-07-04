import React from 'react'

import './Top-bar.css';
import menuIcon from './menu-icon.svg';

const TopBar = () => (
    <div className="Top-bar p-sides-10px">
        <input type="text" placeholder="Toque para adicionar"
            className="big-input h100pct transparent" autoFocus />
        <button title="Show navigation bar" className="btn-icon">
            <img src={menuIcon} alt="Open menu" />
        </button>
    </div>
)

export default TopBar;
