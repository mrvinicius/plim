import React, { useRef, useEffect, useCallback, useState } from 'react'
import { useSwipeable } from 'react-swipeable'

import './Product-item.css'
import { NumberSpinner } from '../shared'

const underlayButtonSize = 115; // 115px

export default function ProductItem({ name, onChange, onRemove, isDisabled, quantity = 0 }) {
  let containerElementRef = useRef(null),
    lastDeltaX = 0;

  const [isTransitionOn, setIsTransitionOn] = useState(false)
  const _translated = useRef(0)
  const swipeHandlers = useSwipeable({
    onSwiping: drag,
    onSwiped: checkIfSwipeWasSubstantial
  })
  const dismissDragOnOutsideClick = useCallback((event) => {
    const productItemRef = containerElementRef.current.firstElementChild;

    const wasClickInside = productItemRef.contains(event.target),
      deleteButtonElement = productItemRef.nextElementSibling,
      wasClickOnDeleteButton = deleteButtonElement.contains(event.target);

    if (!wasClickInside) {
      document.removeEventListener('touchstart', dismissDragOnOutsideClick)

      if (!wasClickOnDeleteButton) {
        productItemRef.addEventListener('transitionend', ({ propertyName }) => {
          if (propertyName === 'transform') {
            setIsTransitionOn(false)
          }
        }, { once: true })

        setTranslated(0)
      }
    }
  }, [containerElementRef]);

  useEffect(() => {
    return () => {
      document.removeEventListener('touchstart', dismissDragOnOutsideClick);
    };
  }, [dismissDragOnOutsideClick]);

  function drag({ deltaX, absX, absY }) {
    if (absX < absY) return

    /* Started draggint left */
    if (deltaX > 0) {
      deltaX > lastDeltaX
        ? dragLeft(lastDeltaX, deltaX) // Drag left
        : dragRight(lastDeltaX, absX) // Changed direction: Drag right
    } else { /* Started draggint right */
      deltaX < lastDeltaX
        ? dragRight(lastDeltaX, absX) // Drag right
        : dragLeft(lastDeltaX, deltaX) // Changed direction: Drag left
    }

    lastDeltaX = deltaX
  }

  function dragLeft(lastDeltaX, deltaX) {
    if (getTranslated() > -underlayButtonSize) {
      const swipedToLeft = deltaX - lastDeltaX,
        draggedToLeft = Math.abs(getTranslated()) + swipedToLeft;

      setTranslated(-draggedToLeft > -underlayButtonSize ? -draggedToLeft : -underlayButtonSize);
    }
  }

  function dragRight(lastDeltaX, absX) {
    if (getTranslated() < 0) {
      const swipedToRight = Math.abs(absX - Math.abs(lastDeltaX)),
        draggedToRight = getTranslated() + swipedToRight;

      setTranslated(draggedToRight < 0 ? draggedToRight : 0);
    }
  }

  function checkIfSwipeWasSubstantial() {
    setIsTransitionOn(true)

    if (getTranslated() > -underlayButtonSize / 2) {
      setTranslated(0)
      document.removeEventListener('touchstart', dismissDragOnOutsideClick)
    } else {
      setTranslated(-underlayButtonSize)
      document.addEventListener('touchstart', dismissDragOnOutsideClick)
    }

    lastDeltaX = 0
  }

  function getTranslated() {
    return _translated.current
  }

  function setTranslated(translated) {
    const productItemRef = containerElementRef.current.firstElementChild;

    _translated.current = translated
    productItemRef.style.transform = `translateX(${translated}px)`
  }

  function setRef(containerElement) {
    containerElementRef.current = containerElement
  }

  return (
    <div ref={setRef} className="Product-item-wrapper list-item">
      <div {...swipeHandlers}
        className={`Product-item side-gaps-pad ${isDisabled ? 'Product-item--disabled' : ''}`}
        style={{
          transition: isTransitionOn ? 'transform 70ms linear' : null,
          transform: `translateX(${getTranslated()}px)`
        }} >
        <input type="text"
          className="Product-item__name no-outline"
          value={name}
          onChange={e => onChange({ name: e.target.value })} />
        <NumberSpinner aria-label="Quantidade"
          min={0}
          quantity={quantity}
          onChange={quantity => onChange({ quantity })} />
      </div>
      <button
        className="list-item__underlay-action fw500"
        onClick={onRemove}
      >
        <img src={process.env.PUBLIC_URL + '/icons/trash.svg'} alt=""/>
        remover
      </button>
    </div>
  )
}