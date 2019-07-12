import React from 'react'

import './Top-bar.css';
import menuIcon from './menu-icon.svg';
import closeIcon from './close-icon.svg';

function TopBar({ inputValue, isActive, onChange, activate, goBack }) {

    const [placeholderText, className] = isActive
        ? ['Produto', 'active']
        : ['Toque para adicionar', ''];

    return (
        <div className={`Top-bar ${className}`}>
            <div className="Top-bar__fixed-container p-sides-10px">
                <input type="text" placeholder={placeholderText}
                    className="big-input h100pct transparent no-outline"
                    value={inputValue}
                    onClick={activate}
                    onChange={onChange}
                    autoFocus />
                <button title="Open navigation bar" className="btn-icon">
                    <img src={menuIcon} alt="Open navigation bar" />
                </button>
                <button title="Cancel product addition" className="btn-icon"
                    onClick={goBack}>
                    <img src={closeIcon} alt="Cancel product addition" />
                </button>
            </div>
        </div>
    )
}

export default TopBar;
