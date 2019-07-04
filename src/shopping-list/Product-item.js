import React from 'react'

import './Product-item.css';
import NumberSpinner from '../number-spinner';

export default function ProductItem({ name, quantity = 0 }) {
    return (
        <div className="Product-item">
            <div className="Product-item__name">{name}</div>
            <NumberSpinner aria-label="Quantidade" min={0} quantity={quantity} />
        </div>
    )
}