import React from 'react'
import './Toast.css'

export default function Toast({ isShown, children, undo }) {
    return (
        <output className={`Toast white-text ${isShown ? 'is-shown' : ''}`} role={isShown ? 'alert' : ''}>
            {children}
            {undo &&
                <button className="Toast__undo fw500" onClick={undo}>
                    <img src={process.env.PUBLIC_URL + '/corner-up-left.svg'}
                        role="presentation" alt=""/>
                    <span>Desfazer</span>
                </button>
            }
        </output>
    )
}
