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
                    // _translated.current = 0

                    productItemRef.addEventListener('transitionend', ({ propertyName }) => {
                        if (propertyName === 'transform') {
                            setIsTransitionOn(false)
                        }
                    }, { once: true })

                    setTranslated(productItemRef, 0)
                    // productItemRef.style.transform = `translateX(${0}px)`;
                }
            }
        }, [containerElementRef]);

    useEffect(() => {
        return () => {
            document.removeEventListener('touchstart', dismissDragOnOutsideClick);
        };
    }, [dismissDragOnOutsideClick]);

    function drag({ event: { currentTarget }, deltaX, absX, absY }) {
        if (absX < absY) return

        /* Started draggint left */
        if (deltaX > 0) {
            deltaX > lastDeltaX
                ? dragLeft(currentTarget, lastDeltaX, deltaX) // Drag left
                : dragRight(currentTarget, lastDeltaX, absX) // Changed direction: Drag right
        } else { /* Started draggint right */
            deltaX < lastDeltaX
                ? dragRight(currentTarget, lastDeltaX, absX) // Drag right
                : dragLeft(currentTarget, lastDeltaX, deltaX) // Changed direction: Drag left
        }

        lastDeltaX = deltaX
    }

    function dragLeft(element, lastDeltaX, deltaX) {
        if (getTranslated() > -100) {
            const swipedToLeft = deltaX - lastDeltaX,
                draggedToLeft = Math.abs(getTranslated()) + swipedToLeft;

            setTranslated(
                element,
                -draggedToLeft > -100 ? -draggedToLeft : -100
            );
        }
    }

    function dragRight(element, lastDeltaX, absX) {
        if (getTranslated() < 0) {
            const swipedToRight = Math.abs(absX - Math.abs(lastDeltaX)),
                draggedToRight = getTranslated() + swipedToRight;

            setTranslated(
                element,
                draggedToRight < 0 ? draggedToRight : 0
            );
        }
    }

    function checkIfSwipeWasSubstantial({ event: { currentTarget } }) {
        setIsTransitionOn(true)

        if (getTranslated() > -50) {
            setTranslated(currentTarget, 0)
            document.removeEventListener('touchstart', dismissDragOnOutsideClick)
        } else {
            setTranslated(currentTarget, -100)

            document.addEventListener('touchstart', dismissDragOnOutsideClick)
        }

        lastDeltaX = 0
    }

    function getTranslated() {
        return _translated.current
    }

    function setTranslated(element, translated) {
        _translated.current = translated
        element.style.transform = `translateX(${translated}px)`
    }

    function setRef(element) {
        containerElementRef.current = element
    }

    return (console.log('mounted'),
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