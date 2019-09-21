import React from 'react'
import './Toast.css'

export default function Toast({ children, undo }) {
    return (
        <output className="Toast white-text" role="alert">
            {children}
            {undo &&
                <button className="undo" onClick={undo}>
                    <img src={process.env.PUBLIC_URL + '/corner-up-left.svg'}
                    role="Presentation" />
                    <span>Desfazer</span>
                </button>
            }
        </output>
    )
}
