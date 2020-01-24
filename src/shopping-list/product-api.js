import { partial } from '../shared/utils';

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
const removeProduct = id => fetch(`/products/${id}`, { method: 'DELETE' }).then(response => response.json());

export { addProduct, updateProduct, listProducts, removeProduct };