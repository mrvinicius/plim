import React, { useRef, useEffect, useCallback, useState } from 'react'
import { useSwipeable } from 'react-swipeable'

import './Product-item.css'
import { NumberSpinner } from '../shared'

export default function ProductItem({ name, onChange, onRemove, quantity = 0 }) {
    let containerElementRef = useRef(null),
        lastDeltaX = 0;

    const [isTransitionOn, setIsTransitionOn] = useState(false),
        _translated = useRef(0),
        swipeHandlers = useSwipeable({
            onSwiping: drag,
            onSwiped: checkIfSwipeWasSubstantial
        }),
        dismissDragOnOutsideClick = useCallback((event) => {
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
        if (getTranslated() > -100) {
            const swipedToLeft = deltaX - lastDeltaX,
                draggedToLeft = Math.abs(getTranslated()) + swipedToLeft;

            setTranslated(-draggedToLeft > -100 ? -draggedToLeft : -100);
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

        if (getTranslated() > -50) {
            setTranslated(0)
            document.removeEventListener('touchstart', dismissDragOnOutsideClick)
        } else {
            setTranslated(-100)
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
                className="Product-item side-gaps-pad"
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
            <button className="list-item__underlay-action"
                onClick={onRemove}>
                Excluir
                </button>
        </div>
    )
}