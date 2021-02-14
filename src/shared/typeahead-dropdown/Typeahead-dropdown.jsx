import React from 'react'

import './Typeahead-dropdown.css';

export default function TypeaheadDropdown({ children, isOpen }) {
    const className =
        `Typeahead-dropdown list side-gaps-pad reset-list white ${isOpen ? 'open' : ''}`;

    return (
        <ul id="typeheadDropdown"
            className={className}
            role="listbox">
            {isOpen && children}
        </ul>
    )
}

export function TypeaheadOption({ children, onSelect, onComplete, ...optionProps }) {
    return (
        <li className="list__item" {...optionProps}>
            <button className="list__option-main-action left" onClick={onSelect}>
                {children}
            </button>
            <button className="list__right-item" onClick={onComplete}
                hidden={!onComplete}>
                <img src={process.env.PUBLIC_URL + '/icons/arrow-up-left.svg'}
                    alt="Complete" />
            </button>
        </li>
    );
}