import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom';

import './Top-bar.css';
import menuIcon from './menu-icon.svg';
import closeIcon from './close-icon.svg';

function TopBar({ history }) {
    const [isActive, setIsActive] = useState(false);
    const activate = () => {
        setIsActive(true);

        if (history.location.state
            && history.location.state.alreadyActivatedBefore) {

            history.goForward();

            return;
        }

        history.replace('', { alreadyActivatedBefore: true })
        history.push('');
    };

    const inactivate = () => setIsActive(false);

    const [placeholderText, className] = isActive
        ? ['Produto', 'active']
        : ['Toque para adicionar', ''];

    useEffect(() => {
        if (isActive) {
            window.addEventListener('popstate', inactivate);
        }

        return () => {
            if (isActive) {
                window.removeEventListener('popstate', inactivate)
            }
        };
    }, [isActive]);

    return (
        <div className={`Top-bar ${className}`}>
            <div className="Top-bar__fixed-container p-sides-10px">
                <input type="text" placeholder={placeholderText}
                    className="big-input h100pct transparent no-outline"
                    onClick={activate} autoFocus />
                <button title="Open navigation bar" className="btn-icon">
                    <img src={menuIcon} alt="Open navigation bar" />
                </button>
                <button title="Cancel product addition" className="btn-icon"
                    onClick={() => history.goBack()}>
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

export default withRouter(TopBar);
