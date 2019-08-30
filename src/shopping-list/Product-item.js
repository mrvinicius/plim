import React from 'react'

import './Product-item.css';
import { NumberSpinner } from '../shared';

export default function ProductItem({ name, onChange, quantity = 0 }) {
    return (
        <div className="Product-item">
            <input type="text"
                className="Product-item__name no-outline"
                value={name}
                onChange={e => onChange({ name: e.target.value })} />
            <NumberSpinner aria-label="Quantidade"
                min={0}
                quantity={quantity}
                onChange={quantity => onChange({ quantity })} />
        </div>
    )
}