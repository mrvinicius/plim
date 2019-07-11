import React from 'react'

import './Product-item.css';
import NumberSpinner from '../number-spinner';

export default function ProductItem({ name, quantity = 0 }) {
    return (
        <div className="Product-item">
            <span className="Product-item__name">{name}</span>
            <NumberSpinner aria-label="Quantidade" min={0} quantity={quantity} />
        </div>
    )
}