import React from 'react';

export const ProductTableHeader: React.FC = () => (
    <tr>
        <th />
        <th className="border-t shipping-cost__product-field shipping-cost__field-title field-header--uneditable">*Producto</th>
        <th className="border-t shipping-cost__product-field shipping-cost__field-title field-header--uneditable">
            *Costo de envío adicional
        </th>
    </tr>
);
