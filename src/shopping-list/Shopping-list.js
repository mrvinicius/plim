import React, { useState, useEffect } from 'react';
import fuzzysort from 'fuzzysort';

import TopBar from '../top-bar';
import ProductItem from './Product-item';
import TypeaheadDropdown, { TypeaheadOption } from '../typeahead-dropdown';
import QuantityDialog from './quantity-dialog';
import { normalizeText } from '../shared/utils';
import { listProducts, addProduct, updateProduct } from '../server-api';

export default function ShoppingList(props) {
    const [products, setProducts] = useState([]);

    const [filterProductsResult, setFilterProductsResult] = useState([]),
        [productAlreadyAdded, setProductAlreadyAdded] = useState(false),
        [isQuantityDialogOpen, setIsQuantityDialogOpen] = useState(false),
        [quantityDialogCallback, setQuantityDialogCallback] = useState(),
        [quantityDialogValue, setQuantityDialogValue] = useState(0);
    const [topBarInputValue, setTopBarInputValue] = useState('');
    const [isTopBarActive, setIsTopBarActive] = useState(false);

    function handleNewProductRequest({ id, name, quantity }) {
        setQuantityDialogCallback(() => {
            return dialogQuantity => {
                // choose action depending on product existence
                id
                    ? update({ id, quantity: dialogQuantity })
                    : add({ name, quantity: dialogQuantity });

                setIsTopBarActive(false);
                setIsQuantityDialogOpen(false);
            }
        });
        setTopBarInputValue('');
        setQuantityDialogValue(quantity);
        setIsQuantityDialogOpen(true);
    }

    function handleProductAdditionNameChange(event) {
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

    function filterProducts(searchedText) {
        return fuzzysort.go(searchedText, products, {
            key: 'searchableName',
            limit: 8,
            allowTypo: false,
            threshold: -10000
        });
    }

    async function add(productData) {
        const newProduct = await addProduct({ ...productData, order: products.length + 1 })
            .catch(e => console.error(e));
        const newProductList = products.slice();

        newProductList.unshift(newProduct);
        setProducts(newProductList);
    }

    function update(productData) {
        const changedProductIndex = products.findIndex(prod => prod.id === productData.id)
        const productsCopy = [...products]
        productsCopy[changedProductIndex] = {
            ...productsCopy[changedProductIndex],
            ...productData
        }


        setProducts(productsCopy);

        try {
            updateProduct(productData)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        listProducts().then(prods => setProducts(
            prods.map(p => ({ ...p, searchableName: normalizeText(p.name) }))
        ));
    }, []);

    return (
        <>
            <TopBar value={topBarInputValue}
                onValueChange={handleProductAdditionNameChange}
                // onNavIconClick={() => setIsNavOpen(true)}
                onToggle={(isOpen) => {
                    setIsTopBarActive(isOpen);
                    if (!isOpen)
                        setTopBarInputValue('');
                }} />

            <section className="side-gaps-pad">
                {products.map(({ id, ...product }) =>
                    <ProductItem key={id} {...product}
                        onChange={updatedProps => update({ id, ...updatedProps })} />
                )}
            </section>

            <TypeaheadDropdown isOpen={isTopBarActive}>
                <TypeaheadOption key={0} hidden={!topBarInputValue.length || productAlreadyAdded}
                    onClick={() => handleNewProductRequest({ name: topBarInputValue })}>
                    <div className="capitalize">{topBarInputValue}</div>
                    <span className="secondary-black-text small-text">Adicionar</span>
                </TypeaheadOption>

                {topBarInputValue.length
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
                }
            </TypeaheadDropdown>

            <QuantityDialog isOpen={isQuantityDialogOpen}
                close={() => setIsQuantityDialogOpen(false)}
                quantity={quantityDialogValue}
                onChange={setQuantityDialogValue}
                onConfirm={() => quantityDialogCallback(quantityDialogValue)} />
        </>
    )
}
