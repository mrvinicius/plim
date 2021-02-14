// import { partial } from '../shared/utils'
import firebase from '../firebase'

const db = firebase.firestore()
const productsRef = db.collection('products')

function listProducts(userId) {
    return productsRef.where('userId', '==', userId)
        .get()
        .then(snapshot => {
            // console.log(snapshot)
            if (!snapshot.empty) {
                return snapshot.docs.map(doc => {
                    const { name, quantity } = doc.data()
                    // console.log(doc)
                    return { name, quantity, id: doc.id }
                })
            } else {
                Promise.resolve([])
            }
        })
}

function addProduct(params) {
    
}

function updateProduct(productData) {
    console.log(productData)
    return productsRef.doc(productData.id)
        .update(productData)
}

function removeProduct(params) {
    
}

// function fetchProducts(data, product) {
//     const URI = `/products${product && product.id ? `/${product.id}` : '/'}`;

//     return fetch(URI, {
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         ...data,
//         body: product && JSON.stringify(product)
//     }).then(response => response.json());
// }

// const addProduct = partial(fetchProducts, { method: 'POST' });
// const updateProduct = partial(fetchProducts, { method: 'PATCH' });
// const listProducts = () => fetch('/products').then(response => response.json());
// const searchProducts = name => fetch('/products/q=${name}').then(response => response.json());
// const getProduct = id => fetch(`/products/${id}`).then(response => response.json());
// const removeProduct = id => fetch(`/products/${id}`, { method: 'DELETE' }).then(response => response.json());

export {
    addProduct,
    updateProduct,
    listProducts,
    removeProduct,
};