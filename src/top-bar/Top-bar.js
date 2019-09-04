import React, { useEffect, useCallback, useContext } from 'react';
import { withRouter } from 'react-router-dom';

import './Top-bar.css';
import { AppContext } from '../App';

function TopBar({ isActive, value, onValueChange, onToggle, history }) {
    const [placeholderText, className] = isActive
        ? ['Produto', 'active']
        : ['Toque para adicionar', ''];
    const openNavBar = useContext(AppContext);

    function activate() {
        if (isActive)
            return;

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
        onToggle(false);
    }, [onToggle])

    useEffect(() => {
        if (isActive) {
            window.addEventListener('popstate', memoInactivate);
        }

        return () => {
            if (isActive) {
                window.removeEventListener('popstate', memoInactivate);
            }
        };
    }, [isActive, memoInactivate]);

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
