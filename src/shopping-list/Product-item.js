import React, { useRef, useEffect, useCallback, useState } from 'react'
import { useSwipeable } from 'react-swipeable'

import './Product-item.css'
import { NumberSpinner } from '../shared'

export default function ProductItem({ name, onChange, onRemove, quantity = 0 }) {
    let productItemRef = null,
        _translated = useRef(0),
        lastDeltaX = 0;

    const [isTransitionOn, setIsTransitionOn] = useState(false),
        swipeHandlers = useSwipeable({
            onSwiping: function (eventData) {
                if (!productItemRef) {
                    productItemRef = eventData.event.currentTarget;
                }

                drag(eventData);
            },
            onSwiped: checkIfSwipeWasSubstantial
        });


    const dismissDragOnOutsideClick = useCallback(
        (event) => {
            const wasClickInside = productItemRef.contains(event.target),
                deleteButtonElement = productItemRef.nextElementSibling,
                wasClickOnDeleteButton = deleteButtonElement.contains(event.target);

            if (!wasClickInside) {
                document.removeEventListener('touchstart', dismissDragOnOutsideClick)

                if (!wasClickOnDeleteButton) {
                    _translated.current = 0
                    productItemRef.style.transform = `translateX(${0}px)`
                    setTimeout(() => {
                        setIsTransitionOn(false)
                    });
                }
            }
        },
        [productItemRef]
    );

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
        console.log(lastDeltaX);
        
    }

    function dragLeft(lastDeltaX, deltaX) {
        if (getTranslated() > -100) {
            const swipedToLeft = deltaX - lastDeltaX,
                draggedToLeft = Math.abs(getTranslated()) + swipedToLeft;

            setTranslated(-draggedToLeft > -100 ? -draggedToLeft : -100)
        }
    }

    function dragRight(lastDeltaX, absX) {
        if (getTranslated() < 0) {
            const swipedToRight = Math.abs(absX - Math.abs(lastDeltaX)),
                draggedToRight = getTranslated() + swipedToRight;

            setTranslated(draggedToRight < 0 ? draggedToRight : 0)
        }
    }

    function checkIfSwipeWasSubstantial(eventData) {
        setIsTransitionOn(true)

        if (getTranslated() > -50) {
            setTranslated(0)
            document.removeEventListener('touchstart', dismissDragOnOutsideClick)
        } else {
            setTranslated(-100)
            document.addEventListener('touchstart', dismissDragOnOutsideClick)
        }

        if (!productItemRef) {
            productItemRef = eventData.event.currentTarget;
        }

        lastDeltaX = 0
    }

    function getTranslated() {
        return _translated.current
    }

    function setTranslated(translated) {
        _translated.current = translated
        productItemRef.style.transform = `translateX(${translated}px)`
    }

    return (console.log('mounted'),
        <div className="Product-item-wrapper list-item">
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