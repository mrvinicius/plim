import React from 'react';

import './Number-spinner.css';

export default function NumberSpinner({ quantity = 0, min = 0, onChange, ...inputProps }) {

    const update = newValue => {
        if (newValue >= min) {
            onChange(newValue);
        }
    }

    return (
        <div className="Number-spinner">
            <input type="number"
                className="Number-spinner__input right"
                min={min}
                value={quantity}
                onChange={e => update(parseInt(e.target.value, 10))}
                onBlur={e => e.target.value = parseInt(e.target.value, 10)}
                {...inputProps} />
            <button aria-label="Aumentar"
                className="Number-spinner__button"
                onClick={() => update(quantity + 1)}>
                <img className="invert-y" src={process.env.PUBLIC_URL + '/chevron-white.svg'} alt=""/>    
            </button>
            <button aria-label="Diminuir"
                className="Number-spinner__button"
                onClick={() => update(quantity - 1)}>
                <img src={process.env.PUBLIC_URL + '/chevron-white.svg'} alt=""/>
            </button>
        </div>
    )
}