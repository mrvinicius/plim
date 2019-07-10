import React, { useState } from 'react'

import './Top-bar.css';
import menuIcon from './menu-icon.svg';
import closeIcon from './close-icon.svg';

function TopBar() {
    const [isActive, setIsActive] = useState(false);
    const activate = () => setIsActive(true);
    const deactivate = () => setIsActive(false);

    let placeholderText = isActive ? 'Produto' : 'Toque para adicionar';

    return (
        <div className={`Top-bar p-sides-10px ${isActive ? 'active' : null}`}>
            <input type="text" placeholder={placeholderText}
                className="big-input h100pct transparent" onBlur={deactivate}
                onTouchEnd={activate} onClick={activate} autoFocus />
            <button title="Open navigation bar" className="btn-icon">
                <img src={menuIcon} alt="Open navigation bar" />
            </button>
            <button title="Cancel product addition" className="btn-icon">
                <img src={closeIcon} alt="Cancel product addition" />
            </button>
        </div>
    )
}

function DropDown() {
    return (
        <ul>

        </ul>
    )
}

export default TopBar;
