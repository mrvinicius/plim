import React, { useState, useEffect, useRef } from 'react';
import fuzzysort from 'fuzzysort';

import './Shopping-list.css';

import TopBar from '../top-bar';
import ProductItem from './Product-item';
import TypeaheadDropdown, { TypeaheadOption } from '../typeahead-dropdown';
import QuantityDialog from './quantity-dialog';
import Toast from '../shared/toast';
import { normalizeText, arrayMove } from '../shared/utils';
import {
  listProducts,
  addProduct,
  updateProduct,
  removeProduct
} from '../server-api';

export default function ShoppingList() {
  const [products, setProducts] = useState([]),
    [filterProductsResult, setFilterProductsResult] = useState([]),
    [productAlreadyAdded, setProductAlreadyAdded] = useState(false),
    [isQuantityDialogOpen, setIsQuantityDialogOpen] = useState(false),
    [quantityDialogCallback, setQuantityDialogCallback] = useState(),
    [quantityDialogValue, setQuantityDialogValue] = useState(0),
    [quantityDialogTitle, setQuantityDialogTitle] = useState('0'),
    [topBarInputValue, setTopBarInputValue] = useState(''),
    [isTopBarFocused, setIsTopBarFocused] = useState(false),
    [isToastShown, setIsToastShown] = useState(false),
    [productToBeRemovedEntry, setProductToBeRemovedEntry] = useState([]),
    remotionTimeout = useRef(NaN),
    toastDismissionTimeout = useRef(NaN);

  function handleNewProductRequest({ id, name, quantity }) {
    setQuantityDialogCallback(() => {
      return dialogQuantity => {
        // choose action depending on product existence
        id
          ? update({
            id,
            quantity: dialogQuantity
          }, true)
          : add({
            name,
            quantity: dialogQuantity
          });

        setIsTopBarFocused(false);
        setIsQuantityDialogOpen(false);
      }
    });
    setTopBarInputValue('');
    setQuantityDialogTitle(name);
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

  function update(productData, shouldAppearAtStart = false) {
    const changedProduct = {
      ...products.find(prod => prod.id === productData.id),
      ...productData
    }

    if (shouldAppearAtStart) {
      setProducts([
        changedProduct,
        ...products.filter(prod => prod.id !== productData.id)
      ])
    } else {
      const productsCopy = [...products]
      const changedProductIndex = productsCopy
        .findIndex(prod => prod.id === productData.id)

      productsCopy[changedProductIndex] = changedProduct

      if ('quantity' in productData) {
        if (productData.quantity === 0) {
          productsCopy[changedProductIndex].isDisabled = true

          const firstDisabledProductIndex = products.findIndex(prod => prod.quantity === 0)
          const newPositionIndex = firstDisabledProductIndex > -1
            ? firstDisabledProductIndex > 0 ? firstDisabledProductIndex - 1 : 0
            : productsCopy.length - 1

          const reorderedProducts = arrayMove(
            productsCopy,
            changedProductIndex,
            newPositionIndex
          )
          setProducts(reorderedProducts)
          return
        } else if (changedProduct.isDisabled && productData.quantity > 0) {
          productsCopy[changedProductIndex].isDisabled = false

          const firstDisabledProductIndex = products.findIndex(prod => prod.quantity === 0)
          const newPositionIndex = firstDisabledProductIndex > -1
            ? firstDisabledProductIndex
            : productsCopy.length - 1

          const reorderedProducts = arrayMove(
            productsCopy,
            changedProductIndex,
            newPositionIndex
          )
          setProducts(reorderedProducts)
          return
        }
      }
      
      setProducts(productsCopy)
    }

    try {
      updateProduct(productData)
    } catch (error) {
      console.error(error);
    }
  }

  function remove(id) {
    const productPosition = products.findIndex(product => product.id === id),
      { [productPosition]: removedProduct, ...remainingProducts } = products;


    setProducts(Object.values(remainingProducts))
    setProductToBeRemovedEntry([productPosition, removedProduct])

    clearTimeout(toastDismissionTimeout.current)
    toastDismissionTimeout.current = setTimeout(setIsToastShown, 4000, false)
    setIsToastShown(true)

    remotionTimeout.current = setTimeout(removeProduct, 4000, id);
  }

  function undoRemotion() {
    clearTimeout(remotionTimeout.current)

    const [position, restoredProduct] = productToBeRemovedEntry,
      productsCopy = [...products];

    productsCopy.splice(position, 0, restoredProduct)

    setIsToastShown(false)
    setProducts(productsCopy)
  }

  useEffect(() => {
    listProducts().then(prods => setProducts(
      prods
        .sort((a, _) => a.quantity === 0 ? 0 : -1)
        .map(p => ({ ...p, searchableName: normalizeText(p.name), isDisabled: p.quantity <= 0 }))
    ));
  }, []);

  return (
    <>
      <TopBar isFocused={isTopBarFocused}
        value={topBarInputValue}
        onValueChange={handleProductAdditionNameChange}
        onToggle={(isFocused) => {
          setIsTopBarFocused(isFocused);
          if (!isFocused)
            setTopBarInputValue('');
        }} />

      <main className="Shopping-list">
        {products
          .map(({ id, ...product }) =>
            <React.Fragment key={id}>
              {product.isDisabled && <hr />}
              <ProductItem {...product}
                onChange={updatedProps => update({ id, ...updatedProps })}
                onRemove={() => remove(id)} />
            </React.Fragment>
          )
        }
      </main>

      <TypeaheadDropdown isOpen={isTopBarFocused}>
        <TypeaheadOption key={0} hidden={!topBarInputValue.length || productAlreadyAdded}
          onClick={() => handleNewProductRequest({ name: topBarInputValue })}>
          <div className="capitalize">{topBarInputValue}</div>
          <span className="secondary-black-text small-text">adicionar</span>
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
        title={quantityDialogTitle}
        quantity={quantityDialogValue}
        onChange={setQuantityDialogValue}
        onConfirm={() => quantityDialogCallback(quantityDialogValue)} />

      <Toast isShown={isToastShown} undo={undoRemotion}>
        Produto removido
            </Toast>
    </>
  )
}
