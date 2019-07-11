import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from "react-router-dom";

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
		<Router>
			<div className="App">
				<TopBar />
				<div className="p-sides-10px">
					{state.products.map(product =>
						<ProductItem key={product.id} {...product} />
					)}
				</div>

				<BottomBar />
			</div>
		</Router>
	);
}

function fetchProducts() {
	return fetch('/products')
		.then(response => response.json())
}

export default App;
