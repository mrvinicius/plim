import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import fuzzysort from 'fuzzysort';

import './App.css';
import TopBar from './top-bar/Top-bar';
// import BottomBar from './bottom-bar/Bottom-bar';
import ProductList from './shopping-list/Product-list';
import TypeaheadDropdown, { TypeaheadOption } from './typeahead-dropdown/Typeahead-dropdown';

function App({ history }) {
	const [products, setProducts] = useState([]),
		[topBarInputValue, setTopBarInputValue] = useState(''),
		[isTopBarActive, setIsTopBarActive] = useState(false);

	const activate = () => {
		if (isTopBarActive)
			return;

		setIsTopBarActive(true);

		if (history.location.state
			&& history.location.state.alreadyActivatedBefore) {

			history.goForward();
			return;
		}

		history.replace('', { alreadyActivatedBefore: true })
		history.push('');
	};

	const inactivate = () => {
		setIsTopBarActive(false);
		setTopBarInputValue('');
	}

	const filterProducts = searchedText => {
		if (searchedText.length) {
			console.log(searchedText.length);

			const fuzzyResult = fuzzysort.go(searchedText, products, {
				key: 'name',
				limit: 8,
				allowTypo: false,
				threshold: -10000
			})

			return fuzzyResult.reduce((filtered, result) => {
				// No need to include option that is already suggested
				// based on the searched value
				if (result.obj.name !== searchedText) {
					filtered.push(result.obj)
				}

				return filtered;
			}, []);
		} else {
			return products;
		}

	}

	useEffect(() => {
		listProducts().then(setProducts);
	}, []);

	useEffect(() => {
		if (isTopBarActive) {
			window.addEventListener('popstate', inactivate);
		}

		return () => {
			if (isTopBarActive) {
				window.removeEventListener('popstate', inactivate)
			}
		};
	}, [isTopBarActive]);

	return (
		<div className="App">
			<TopBar value={topBarInputValue}
				isActive={isTopBarActive}
				onChange={e => setTopBarInputValue(e.target.value)}
				onClick={activate}
				aria-controls="typeahead-results"
				goBack={() => history.goBack()} />

			<ProductList products={products} onChange={updateProduct} />

			<TypeaheadDropdown active={isTopBarActive}>
				<TypeaheadOption key={0} hidden={!topBarInputValue.length}>
					<div className="capitalize">{topBarInputValue}</div>
					<span className="secondary-black-text small-text">Adicionar</span>
				</TypeaheadOption>

				{isTopBarActive && filterProducts(topBarInputValue)
					.map(({ id, name }) =>
						<TypeaheadOption key={id} children={name} />
					)}
			</TypeaheadDropdown>


			{/* <BottomBar /> */}
		</div>

	);
}

function partial(fn, ...presetArgs) {
	return function partiallyApplied(...laterArgs) {
		return fn(...presetArgs, ...laterArgs);
	};
}

function fetchProducts(data, product) {
	const URI = `/products${product && product.id ? `/${product.id}` : '/'}`;

	return fetch(URI, {
		headers: {
			'Content-Type': 'application/json'
		},
		...data,
		body: product && JSON.stringify(product)
	}).then(response => response.json());
}

const addProduct = partial(fetchProducts, { method: 'POST' });
const updateProduct = partial(fetchProducts, { method: 'PATCH' });
const listProducts = () => fetch('/products').then(response => response.json());
// const searchProducts = name => fetch('/products/q=${name}').then(response => response.json());
const getProduct = id => fetch(`/products/${id}`).then(response => response.json());
const removeProduct = id => fetch(`/products/${id}`, { method: 'DELETE' }).then(response => response.json());

export default withRouter(App);