import React from 'react';

import Modal from '../../modal';
import NumberSpinner from '../../number-spinner';

const QuantityDialog = ({ quantity, onChange, onConfirm, onCancel, ...modalProps }) => {

    return (
        <Modal {...modalProps}
            header={<h3 className="Modal__title">Quantidade</h3>}>

            {modalProps.isOpen && <NumberSpinner aria-label="Quantidade"
                quantity={quantity}
                onChange={onChange} />}

            <div className="Modal__actions">
                <button className="button red-bg white-text"
                    onClick={modalProps.close}>
                    Cancelar
            </button>
                <button className="button red-bg white-text"
                    onClick={onConfirm}>
                    Adicionar
            </button>
            </div>
        </Modal>
    )
}

export default QuantityDialog
