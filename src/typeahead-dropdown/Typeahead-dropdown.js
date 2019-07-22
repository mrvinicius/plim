import React from 'react'

import './Typeahead-dropdown.css';


export default function TypeaheadDropdown({ children, active }) {
    const className = active ? 'active' : '';

    return (
        <ul className={`Typeahead-dropdown list reset-list p-sides-10px white ${className}`}
            role="listbox"
            id="typeahead-results">
            {children}
        </ul>
    )
}

export function TypeaheadOption({ children, onSelect, onComplete, ...optionProps }) {
    return (
        <li className="list__item" {...optionProps}>
            <button className="list__option-main-action left" onClick={onSelect}>
                {children}
            </button>
            <button className="list__right-icon" onClick={onComplete}
                hidden={!onComplete}>
                <img src={process.env.PUBLIC_URL + '/arrow-up-left.svg'}
                    alt="Complete" />
            </button>
        </li>
    );
}