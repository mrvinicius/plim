import React from 'react';
// import { createPortal } from 'react-dom';

import './Bottom-bar.css';
// import { usePortal } from '../shared';

export default function BottomBar(props) {
	// const target = usePortal('bottomBarWrapper');

	// return createPortal(
	// 	props.children,
	// 	target
	// );

	return (
		<div id="bottomBarWrapper"
			role="toolbar"
			className="Bottom-bar white side-gaps-pad">
			{props.children}
		</div>
	)
}