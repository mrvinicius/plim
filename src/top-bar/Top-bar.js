import React, { useState, useEffect, useCallback, useContext } from 'react';
import { withRouter } from 'react-router-dom';

import './Top-bar.css';
import { AppContext } from '../App';

function TopBar({ value, onValueChange, onToggle, history }) {
    const [isTopBarActive, setIsTopBarActive] = useState(false);
    const [placeholderText, className] = isTopBarActive
        ? ['Produto', 'active']
        : ['Toque para adicionar', ''];
    const openNavBar = useContext(AppContext);

    function activate() {
        if (isTopBarActive)
            return;

        setIsTopBarActive(true);
        onToggle(true);

        if (history.location.state
            && history.location.state.alreadyActivatedBefore) {

            history.goForward();
            return;
        }

        history.replace('', { alreadyActivatedBefore: true })
        history.push('');
    }

    const memoInactivate = useCallback(() => {
        setIsTopBarActive(false);
        onToggle(false);
    }, [onToggle])

    useEffect(() => {
        if (isTopBarActive) {
            window.addEventListener('popstate', memoInactivate);
        }

        return () => {
            if (isTopBarActive) {
                window.removeEventListener('popstate', memoInactivate);
            }
        };
    }, [isTopBarActive, memoInactivate]);

    return (
        <div className={`Top-bar ${className}`}>
            <div className="Top-bar__fixed-container">
                <input type="text" placeholder={placeholderText}
                    className="big-input h100pct transparent no-outline"
                    aria-label="Adicionar Produto"
                    aria-controls="typeheadDropdown"
                    autoComplete="off"
                    autoFocus
                    value={value}
                    onClick={activate}
                    onChange={onValueChange} />
                <button title="Open navigation bar" className="btn-icon"
                    onClick={openNavBar}>
                    <img src={process.env.PUBLIC_URL + '/menu-icon.svg'} alt="Open navigation bar" />
                </button>
                <button title="Cancel product addition" className="btn-icon"
                    onClick={() => history.goBack()}>
                    <img src={process.env.PUBLIC_URL + '/close-icon.svg'} alt="Cancel product addition" />
                </button>
            </div>
        </div>
    )
}

export default withRouter(TopBar);
