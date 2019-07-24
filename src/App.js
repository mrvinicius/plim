import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from "react-router-dom";

import './App.css';
// import BottomBar from './bottom-bar/Bottom-bar';
import ProductList from './shopping-list/Product-list';
import TopBarContainer from './top-bar/Top-bar-container';
import { normalizeText } from './utils';
import { listProducts, updateProduct } from './server-api';

function App() {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		listProducts().then(prods => setProducts(
			prods.map(p => ({ ...p, searchableName: normalizeText(p.name) }))
		));
	}, []);

	return (
		<div className="App">
			<Router>
				<TopBarContainer products={products} />
			</Router>

			<ProductList products={products} onChange={updateProduct} />

			{/* <BottomBar /> */}
		</div>

	);
}

export default App;