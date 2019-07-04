import React, { useState, useEffect } from 'react';

import './App.css';
import BottomBar from './bottom-bar/Bottom-bar';
import ProductItem from './shopping-list/Product-item';

function App() {
	const [state, setState] = useState({ products: [] })

	useEffect(() => {
		fetchProducts().then(prods => setState({ products: prods }));
	}, []);

	return (
		<div className="App">
			<div className="Input-area">
				<input type="text" placeholder="Toque para adicionar"
					className="Input-area__text" autoFocus />
			</div>
			{/* {ProductList()} */}

			{state.products.map(product =>
				<ProductItem key={product.id} {...product} />
			)}

			<BottomBar />
		</div>
	);
}

function fetchProducts() {
	return fetch('http://localhost:3000/products')
		.then(response => response.json())
}

export default App;
