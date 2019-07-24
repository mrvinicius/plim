import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import fuzzysort from 'fuzzysort';

import TopBar from './Top-bar';
import TypeaheadDropdown, { TypeaheadOption } from '../typeahead-dropdown/Typeahead-dropdown';
import QuantityDialog from '../shopping-list/quantity-dialog';
import { normalizeText } from '../utils';
import { addProduct, updateProduct } from '../server-api';


function TopBarContainer({ products, onSelect, history }) {
    const [topBarInputValue, setTopBarInputValue] = useState(''),
        [isTopBarActive, setIsTopBarActive] = useState(false),
        [filterProductsResult, setFilterProductsResult] = useState([]),
        [productAlreadyAdded, setProductAlreadyAdded] = useState(false),
        [isQuantityDialogOpen, setIsQuantityDialogOpen] = useState(false),
        [quantityDialogCallback, setQuantityDialogCallback] = useState(),
        [quantityDialogValue, setQuantityDialogValue] = useState(0);

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
                id ? updateProduct({ id, quantity: dialogQuantity })
                    : addProduct({ name, quantity: dialogQuantity });

                setIsQuantityDialogOpen(false);
            }
        });

        setQuantityDialogValue(quantity);
        setIsQuantityDialogOpen(true);
    }


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
        <>
            <TopBar value={topBarInputValue}
                isActive={isTopBarActive}
                onChange={handleProductAdditionNameChange}
                onClick={activate}
                aria-controls="typeahead-results"
                goBack={() => history.goBack()} />

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

            <QuantityDialog isOpen={isQuantityDialogOpen}
                close={() => setIsQuantityDialogOpen(false)}
                quantity={quantityDialogValue}
                onChange={setQuantityDialogValue}
                onConfirm={() => quantityDialogCallback(quantityDialogValue)} />
        </>
    )
}

export default withRouter(TopBarContainer);