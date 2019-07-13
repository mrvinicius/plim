import React from 'react'

import './Bottom-bar.css';

export default function BottomBar() {
	return (
		<div className="Bottom-bar white p-sides-10px" role="toolbar">
			<button className="btn black-light">
				<img src={process.env.PUBLIC_URL + '/play-circle.svg'} className="btn__icon" alt="" />
				Iniciar compra
			</button>
		</div>
	)
}
