import React from 'react';
import { Text } from '@components/table-input';
import { IHeaderTableInvoice } from '.';
import './HeaderTableInvoice.scss';

export const HeaderTableInvoice: React.FC<IHeaderTableInvoice> = ({ isMandate, isDocument }) => {
    return (
        <tr className="header-table-invoice">
            {isDocument && <td className="table-checkbox" />}
            <td className="field-header--uneditable table-title field-record-index">
                <Text type="text" className="field-header--uneditable__text" text="No." />
            </td>
            <td className="field-header--uneditable table-title fields-width-240">
                <div className="content-text-icon">
                    <Text
                        text="SKU/Código de servicio - Producto/Servicio"
                        className="field-header--uneditable__text"
                        type="text"
                        tooltipInfo
                        titleTooltip="SKU/Código - Producto/servicio:"
                        descTooltip="es el código único de identificación y el nombre de sus productos/servicios."
                    />
                </div>
            </td>
            <td className="field-header--uneditable table-title field-description">
                <div className="content-text-icon">
                    <Text
                        text="Descripción"
                        className="field-header--uneditable__text"
                        type="text"
                        tooltipInfo
                        titleTooltip="Descripción:"
                        descTooltip="información adicional para la venta del producto/servicio."
                    />
                </div>
            </td>

            <td className="field-header--uneditable table-title field-store">
                <div className="content-text-icon">
                    <Text
                        text="Bodega"
                        className="field-header--uneditable__text"
                        type="text"
                        tooltipInfo
                        titleTooltip="Bodega:"
                        descTooltip="es el nombre de la(s) bodega(s) en las que está almacenado el producto."
                    />
                </div>
            </td>
            <td className="field-header--uneditable table-title field-store">
                <div className="content-text-icon">
                    <Text
                        text="Lote"
                        className="field-header--uneditable__text"
                        type="text"
                        tooltipInfo
                        titleTooltip="Lote:"
                        descTooltip="es la identificación del lote del producto."
                    />
                </div>
            </td>
            <td className="field-header--uneditable table-title field-store">
                <div className="content-text-icon">
                    <Text
                        text="Fecha de vencimiento"
                        className="field-header--uneditable__text"
                        type="text"
                        tooltipInfo
                        titleTooltip="Fecha de vencimiento:"
                        descTooltip="es la fecha de expiración de su producto."
                    />
                </div>
            </td>
            <td className="field-header--uneditable table-title field-quantity">
                <div className="content-text-icon">
                    <Text
                        text="Cantidad"
                        className="field-header--uneditable__text"
                        type="text"
                        tooltipInfo
                        titleTooltip="Cantidad:"
                        descTooltip="es la cantidad del producto vendida a su cliente."
                    />
                </div>
            </td>
            <td className="field-header--uneditable table-title field-store">
                <div className="content-text-icon">
                    <Text
                        text="Unidad de medida"
                        className="field-header--uneditable__text"
                        type="text"
                        tooltipInfo
                        titleTooltip="Unidad de medida:"
                        descTooltip="es la magnitud con la que se mide su producto/servicio."
                    />
                </div>
            </td>
            {isMandate && (
                <td className="field-header--uneditable table-title fields-mandate">
                    <div className="content-text-icon">
                        <Text text="*Proveedor o tercero" className="field-header--uneditable__text" type="text" tooltipInfo />
                    </div>
                </td>
            )}
            <td className="field-header--uneditable table-title unit-value-field">
                <div className="content-text-icon">
                    <Text
                        text="Costo unitario"
                        className="field-header--uneditable__text"
                        type="text"
                        tooltipInfo
                        titleTooltip="Costo unitario:"
                        descTooltip="es el precio de venta de una unidad de la referencia del producto."
                    />
                </div>
            </td>
            <td className="field-header--uneditable table-title field-store">
                <div className="content-text-icon">
                    <Text
                        text="% de descuento"
                        className="field-header--uneditable__text"
                        type="text"
                        tooltipInfo
                        titleTooltip="Porcentaje de descuento:"
                        descTooltip="es el porcentaje del valor venta que se disminuye al producto/servicio."
                    />
                </div>
            </td>
            <td className="field-header--uneditable table-title field-store">
                <div className="content-text-icon">
                    <Text
                        text="Descuento"
                        className="field-header--uneditable__text"
                        type="text"
                        tooltipInfo
                        titleTooltip="Descuento:"
                        descTooltip="es el resultado de la siguiente operación (valor venta * Porcentaje descuento)."
                    />
                </div>
            </td>
            <td className="field-header--uneditable table-title field-quantity">
                <div className="content-text-icon">
                    <Text
                        text="Impuestos"
                        className="field-header--uneditable__text"
                        type="text"
                        tooltipInfo
                        titleTooltip="Impuestos:"
                        descTooltip="Obligaciones tributarias que la persona o empresa deben pagar al estado."
                    />
                </div>
            </td>
            {!isDocument && <td className="table-checkbox" />}
        </tr>
    );
};
