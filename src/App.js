import React, { useState, useEffect } from 'react';

import './App.css';
import TopBar from './top-bar/Top-bar';
import BottomBar from './bottom-bar/Bottom-bar';
import ProductItem from './shopping-list/Product-item';

function App() {
	const [state, setState] = useState({ products: [] })

	useEffect(() => {
		fetchProducts().then(prods => setState({ products: prods }));
	}, []);

	return (
		<div className="App">
			<TopBar />
			<div className="p-sides-10px">
				{state.products.map(product =>
					<ProductItem key={product.id} {...product} />
				)}
			</div>

			<BottomBar />
		</div>
	);
}

function fetchProducts() {
	return fetch('http://192.168.25.10:3000/products')
		.then(response => response.json())
}

export default App;
