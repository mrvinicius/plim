import React, { useEffect, useCallback, useContext } from 'react';
import { withRouter } from 'react-router-dom';

import './Top-bar.css';
import { AppContext } from '../App';

function TopBar({ isFocused, value, onValueChange, onToggle, history }) {
    const [placeholderText, className] = isFocused
        ? ['Produto', 'Top-bar--focused']
        : ['Toque para adicionar', ''];
    const { toggleNav, isNavOpen } = useContext(AppContext);

    function activate() {
        if (isFocused)
            return;

        onToggle(true);

        // if (history.location.state
        //     && history.location.state.alreadyActivatedBefore) {

        //     history.goForward();
        //     return;
        // }

        // history.replace('', { alreadyActivatedBefore: true })
        history.push('');
    }

    const memoInactivate = useCallback(() => {
        onToggle(false);
    }, [onToggle])

    useEffect(() => {
        if (isFocused) {
            window.addEventListener('popstate', memoInactivate);
        }

        return () => {
            if (isFocused) {
                window.removeEventListener('popstate', memoInactivate);
            }
        };
    }, [isFocused, memoInactivate]);

    return (
        <div className={`Top-bar ${className} ${isNavOpen && 'Top-bar--disabled'}`}>
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
                {!isNavOpen && <button  className="btn-icon" onClick={() => toggleNav(true)}>
                    <img src={process.env.PUBLIC_URL + '/menu-icon.svg'} alt="Open navigation bar" />
                </button>}
                {isNavOpen && <button className="btn-icon" onClick={() => toggleNav(false)}>
                    <img src={process.env.PUBLIC_URL + '/close-icon.svg'} alt="Close navigation bar" />
                </button>}
                <button title="Cancel product addition" className="btn-icon"
                    onClick={() => history.goBack()}>
                    <img src={process.env.PUBLIC_URL + '/close-icon.svg'} alt="Cancel product addition" />
                </button>
            </div>
        </div>
    )
}

export default withRouter(TopBar);
