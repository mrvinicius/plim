import React, { useState } from 'react'
import { useSwipeable } from 'react-swipeable'

import './Product-item.css'
import { NumberSpinner } from '../shared'

export default function ProductItem({ name, onChange, onRemove, quantity = 0 }) {
    const handlers = useSwipeable({
        onSwiping: drag,
        onSwiped: checkIfSwipeWasSubstantial
    })

    const [translated, setTranslated] = useState(0)
    const [lastDeltaX, setLastDeltaX] = useState(0)

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
            const swipedToLeft = deltaX - lastDeltaX
            const draggedToLeft = Math.abs(translated) + swipedToLeft

            setTranslated(-draggedToLeft > -100 ? -draggedToLeft : -100)
        }
    }

    function dragRight(lastDeltaX, absX) {
        if (translated < 0) {
            const swipedToRight = Math.abs(absX - Math.abs(lastDeltaX))
            const draggedToRight = translated + swipedToRight

            setTranslated(draggedToRight < 0 ? draggedToRight : 0)
        }
    }

    function checkIfSwipeWasSubstantial(eventData) {
        const element = eventData.event.currentTarget,
            underlayButton = element.nextElementSibling;

        if (translated > -50) {
            setTranslated(0)
            console.log('removed');
            document.removeEventListener('touchstart', handleOutsideClick)
        } else {
            setTranslated(-100)
            document.addEventListener('touchstart', handleOutsideClick)
        }

        setLastDeltaX(0)

        function handleOutsideClick(event) {
            const wasClickInside = element.contains(event.target),
                wasClickOnUnderlayButton = underlayButton
                    .contains(event.target);
            // console.log('handler called');


            if (!wasClickInside) {
                console.log('removed in handler');
                document.removeEventListener('touchstart', handleOutsideClick)

                if (!wasClickOnUnderlayButton) {
                    setTranslated(0)
                }
            }
        }
    }

    return (
        <div className="Product-item-wrapper list-item">
            <div className="Product-item side-gaps-pad"
                {...handlers}
                style={{ transform: `translateX(${translated}px)` }} >
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