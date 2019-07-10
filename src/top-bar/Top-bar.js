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
        <div className={`Top-bar ${isActive ? 'active' : ''}`}>
            <div className="Top-bar__fixed-container p-sides-10px">
                <input type="text" placeholder={placeholderText}
                    className="big-input h100pct transparent no-outline"
                    onTouchEnd={activate} onClick={activate} autoFocus />
                <button title="Open navigation bar" className="btn-icon">
                    <img src={menuIcon} alt="Open navigation bar" />
                </button>
                <button title="Cancel product addition" className="btn-icon"
                    onClick={deactivate}>
                    <img src={closeIcon} alt="Cancel product addition" />
                </button>
            </div>
            <div className="Top-bar__drop-down-wrapper p-sides-10px w100pct white">
                <ul className="list reset-list">
                    <li className="list__item">ADD</li>
                    <li className="list__item">Autocomplete</li>
                    <li className="list__item">Histórico</li>
                </ul>
            </div>
        </div>
    )
}

export default TopBar;
