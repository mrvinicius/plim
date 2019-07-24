import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import fuzzysort from 'fuzzysort';

import './App.css';
// import BottomBar from './bottom-bar/Bottom-bar';
import ProductList from './shopping-list/Product-list';
import Modal from './modal/Modal';
import TopBar from './top-bar/Top-bar';
import NumberSpinner from './number-spinner';
import TypeaheadDropdown, { TypeaheadOption } from './typeahead-dropdown/Typeahead-dropdown';

function App({ history }) {
	const [products, setProducts] = useState([]),
		[topBarInputValue, setTopBarInputValue] = useState(''),
		[isTopBarActive, setIsTopBarActive] = useState(false),
		[isQuantityDialogOpen, setIsQuantityDialogOpen] = useState(false),
		[quantityDialogCallback, setQuantityDialogCallback] = useState(),
		[quantityDialogValue, setQuantityDialogValue] = useState(0),
		[filterProductsResult, setFilterProductsResult] = useState([]),
		[productAlreadyAdded, setProductAlreadyAdded] = useState(false);

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
		return fuzzysort.go(searchedText, products, {
			key: 'searchableName',
			limit: 8,
			allowTypo: false,
			threshold: -10000
		});
	}

	const handleProductAdditionNameChange = event => {
		const searchedText = event.target.value,
			normalizeSearchedText = normalizeText(searchedText);

		setTopBarInputValue(searchedText);

		if (searchedText.length) {
			const fuzzyresult = filterProducts(normalizeSearchedText);

			setFilterProductsResult(fuzzyresult);
			setProductAlreadyAdded(fuzzyresult.length === 1
				&& fuzzyresult[0].score === 0);
		}
	}

	const handleNewProductRequest = ({ id, name, quantity }) => {
		setQuantityDialogCallback(() => {
			return dialogQuantity => {
				// choose action depending on product existence
				id
					? updateProduct({ id, quantity: dialogQuantity })
					: addProduct({ name, quantity: dialogQuantity });

				setIsQuantityDialogOpen(false);
			}
		});

		setQuantityDialogValue(quantity);
		setIsQuantityDialogOpen(true);
	}

	useEffect(() => {
		listProducts().then(prods => {
			prods.forEach(p => {
				p.searchableName = normalizeText(p.name);
			});

			setProducts(prods);
		});
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
				onChange={handleProductAdditionNameChange}
				onClick={activate}
				aria-controls="typeahead-results"
				goBack={() => history.goBack()} />

			<ProductList products={products} onChange={updateProduct} />

			<TypeaheadDropdown active={isTopBarActive}>
				<TypeaheadOption key={0} hidden={!topBarInputValue.length || productAlreadyAdded}
					onClick={() => handleNewProductRequest({ name: topBarInputValue })}>
					<div className="capitalize">{topBarInputValue}</div>
					<span className="secondary-black-text small-text">Adicionar</span>
				</TypeaheadOption>

				{isTopBarActive
					? topBarInputValue.length
						? filterProductsResult.map(({ obj: p }) =>
							<TypeaheadOption key={p.id}
								children={p.name}
								onSelect={() => handleNewProductRequest(p)}
								onComplete={() => setTopBarInputValue(p.name)} />
						)
						: products.map(p =>
							<TypeaheadOption key={p.id}
								children={p.name}
								onSelect={() => handleNewProductRequest(p)}
								onComplete={() => setTopBarInputValue(p.name)} />
						)
					: null}
			</TypeaheadDropdown>

			<Modal isOpen={isQuantityDialogOpen}
				close={() => setIsQuantityDialogOpen(false)}
				header={<h2 className="Modal__title">Quantidade</h2>}>
				{isQuantityDialogOpen && <NumberSpinner aria-label="Quantidade"
					quantity={quantityDialogValue}
					onChange={setQuantityDialogValue} />}
				<div className="Modal__actions">
					<button className="button red-bg white-text"
						onClick={() => setIsQuantityDialogOpen(false)}>
						Cancelar
					</button>
					<button className="button red-bg white-text"
						onClick={() => quantityDialogCallback(quantityDialogValue)}>
						Adicionar
					</button>
				</div>
			</Modal>
			{/* <BottomBar /> */}
		</div>

	);
}

function normalizeText(text) {
	text = text.toLowerCase();
	text = text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
	text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
	text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
	text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
	text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
	text = text.replace(new RegExp('[Ç]', 'gi'), 'c');
	return text;
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
// const getProduct = id => fetch(`/products/${id}`).then(response => response.json());
// const removeProduct = id => fetch(`/products/${id}`, { method: 'DELETE' }).then(response => response.json());

export default withRouter(App);