import React from 'react';

import './Quantity-dialog.css';
import { Modal, NumberSpinner } from '../../shared';

const QuantityDialog = ({ title, quantity, onChange, onConfirm, onCancel, ...modalProps }) => {

	return (
		<Modal
			{...modalProps}
			header={<h3 className="Modal__title fw400">{title}<span className="small-text">quantidade</span></h3>}
			className="quantity-dialog"
		>

			{<NumberSpinner aria-label="Quantidade"
				quantity={modalProps.isOpen ? quantity : 0}
				onChange={modalProps.isOpen && onChange} />}

			<div className="Modal__actions">
				<button className="button red-bg white-text"
					onClick={modalProps.close}>
					Voltar
				</button>
				<button className="button red-bg white-text fw500"
					onClick={onConfirm}>
					Salvar
				</button>
			</div>
		</Modal>
	)
}

export default QuantityDialog
