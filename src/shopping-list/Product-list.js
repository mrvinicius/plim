import React from 'react';

import ProductItem from './Product-item';

function ProductList({ products, onChange }) {
	return (
		<div className="p-sides-10px">
			{products.map(({ id, ...product }) =>
				<ProductItem key={id} {...product}
					onChange={updatedProps => onChange({ id, ...updatedProps })} />
			)}
		</div>
	)
}

export default ProductList;
