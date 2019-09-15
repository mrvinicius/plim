import React, { useEffect, useCallback, useState } from 'react'
import { useSwipeable } from 'react-swipeable'

import './Product-item.css'
import { NumberSpinner } from '../shared'

export default function ProductItem({ name, onChange, onRemove, quantity = 0 }) {
    let productItemRef = null;

    const [translated, setTranslated] = useState(0),
        [lastDeltaX, setLastDeltaX] = useState(0),
        [isTransitionOn, setIsTransitionOn] = useState(false),
        swipeHandlers = useSwipeable({
            onSwiping: function (eventData) {
                drag(eventData);

                if (!productItemRef) {
                    productItemRef = eventData.event.currentTarget;
                }
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
                    setTranslated(0)
                    setTimeout(() => {
                        setIsTransitionOn(false)
                    });
                }
            }
        },
        [productItemRef],
    );

    useEffect(() => {
        return () => {
            document.removeEventListener('touchstart', dismissDragOnOutsideClick);
        };
    }, [dismissDragOnOutsideClick]);


    function drag({ deltaX, absX, absY }) {
        if (absX < absY) return

        /* Started draggin left */
        if (deltaX > 0) {
            deltaX > lastDeltaX
                ? dragLeft(lastDeltaX, deltaX) // Drag left
                : dragRight(lastDeltaX, absX) // Changed direction: Drag right
        } else { /* Started draggin right */
            deltaX < lastDeltaX
                ? dragRight(lastDeltaX, absX) // Drag right
                : dragLeft(lastDeltaX, deltaX) // Changed direction: Drag left
        }

        setLastDeltaX(deltaX)
    }

    function dragLeft(lastDeltaX, deltaX) {
        if (translated > -100) {
            const swipedToLeft = deltaX - lastDeltaX,
                draggedToLeft = Math.abs(translated) + swipedToLeft;

            setTranslated(-draggedToLeft > -100 ? -draggedToLeft : -100)
        }
    }

    function dragRight(lastDeltaX, absX) {
        if (translated < 0) {
            const swipedToRight = Math.abs(absX - Math.abs(lastDeltaX)),
                draggedToRight = translated + swipedToRight;

            setTranslated(draggedToRight < 0 ? draggedToRight : 0)
        }
    }

    function checkIfSwipeWasSubstantial(eventData) {
        setIsTransitionOn(true)

        if (translated > -50) {
            setTranslated(0)
            document.removeEventListener('touchstart', dismissDragOnOutsideClick)
        } else {
            setTranslated(-100)
            document.addEventListener('touchstart', dismissDragOnOutsideClick)
        }

        if (!productItemRef) {
            productItemRef = eventData.event.currentTarget;
        }

        setLastDeltaX(0)
    }

    function turnOffTransition() {
    }

    return (
        <div className="Product-item-wrapper list-item">
            <div className="Product-item side-gaps-pad"
                {...swipeHandlers}
                onTransitionEnd={turnOffTransition}
                style={{
                    transition: isTransitionOn ? 'transform 70ms linear' : null,
                    transform: `translateX(${translated}px)`
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