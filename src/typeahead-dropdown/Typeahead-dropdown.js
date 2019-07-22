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

export function TypeaheadOption({ children, onClick, ...optionProps }) {
    return (
        <li className="list__item" {...optionProps}>
            <button onClick={onClick}>{children}</button>
        </li>
    );
}