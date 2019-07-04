import React, { useState } from 'react';

import './Number-spinner.css';

export default function NumberSpinner({ quantity, min, ...otherProps }) {
    const [count, setCount] = useState(quantity >= min ? quantity : 0);

    const update = newValue => {
        if (newValue >= min) {
            setCount(newValue)
        }
    }

    return (
        <div>
            <input type="number"
                min={min}
                value={count}
                onChange={e => update(parseInt(e.target.value, 10))}
                onBlur={e => e.target.value = parseInt(e.target.value, 10)}
                {...otherProps} />
            <button aria-label="Aumentar" onClick={() => update(count + 1)}>+</button>
            <button aria-label="Diminuir" onClick={() => update(count - 1)}>-</button>
        </div>
    )
}