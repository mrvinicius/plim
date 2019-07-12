import React, { useState } from 'react';

import './Number-spinner.css';

export default function NumberSpinner({ quantity, min, ...inputProps }) {
    const [count, setCount] = useState(quantity >= min ? quantity : 0);

    const update = newValue => {
        if (newValue >= min) {
            setCount(newValue)
        }
    }

    return (
        <div className="Number-spinner">
            <button aria-label="Diminuir"
                className="Number-spinner__button"
                onClick={() => update(count - 1)}>-</button>
            <input type="number"
                className="Number-spinner__input big-input center"
                min={min}
                value={count}
                onChange={e => update(parseInt(e.target.value, 10))}
                onBlur={e => e.target.value = parseInt(e.target.value, 10)}
                {...inputProps} />
            <button aria-label="Aumentar"
                className="Number-spinner__button"
                onClick={() => update(count + 1)}>+</button>
        </div>
    )
}