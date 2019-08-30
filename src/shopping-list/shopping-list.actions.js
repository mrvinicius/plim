const ADD_PRODUCT = 'ADD_PRODUCT',
    CHANGE_PRODUCT = 'CHANGE_PRODUCT',
    LIST_PRODUCTS = 'LIST_PRODUCTS',
    FILTER_PRODUCTS = 'FILTER_PRODUCTS';

export const addProduct = product => ({
    type: ADD_PRODUCT,
    payload: { product }
});

export const changeProduct = product => ({
    type: CHANGE_PRODUCT,
    payload: { product }
});

export const listProducts = () => ({
    type: LIST_PRODUCTS,
    payload: {}
});

export const filterProducts = searchedText => ({
    type: FILTER_PRODUCTS,
    payload: { searchedText }
});

export const actionTypes = {
    ADD_PRODUCT,
    CHANGE_PRODUCT,
    LIST_PRODUCTS,
    FILTER_PRODUCTS
};