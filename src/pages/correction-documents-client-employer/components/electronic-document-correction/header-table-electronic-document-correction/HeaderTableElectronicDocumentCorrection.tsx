import React from 'react';
import { Link, LinkColor } from '@components/button';
import { TooltipTable } from '@components/tooltip-table';
import { IHeaderTableInvoice } from '@components/electronic-invoice/components/header-table-invoice';
import '@components/electronic-invoice/components/header-table-invoice/HeaderTableInvoice.scss';

export const HeaderTableElectronicDocumentCorrection: React.FC<IHeaderTableInvoice> = ({ isMandate, isSupplierNote = false }) => {
    return (
        <tr className="header-table-invoice">
            <td className="table-checkbox" />
            <td className="field-header--uneditable table-title field-record-index">No.</td>
            <td className="field-header--uneditable table-title fields-width-103">SKU/Código de servicio - Producto/Servicio</td>
            <td className="field-header--uneditable table-title field-product">Producto/Servicio</td>
            <td className="field-header--uneditable table-title fields-width-103">Bodega</td>
            <td className="field-header--uneditable table-title field-batch">Lote</td>
            <td className="field-header--uneditable table-title field-date">Fecha de vencimiento</td>
            <td className="field-header--uneditable table-title field-description">Descripción</td>
            <td className="field-header--uneditable table-title field-quantity">Cantidad</td>
            <td className="field-header--uneditable table-title field-measure">Unidad de medida</td>
            {isMandate && (
                <>
                    <td className="field-header--uneditable table-title fields-mandate">ID. Tercero</td>
                    <td className="field-header--uneditable table-title fields-mandate">Tercero</td>
                </>
            )}
            <td className="field-header--uneditable table-title fields-width-117">Valor unitario</td>
            {isSupplierNote && <td className="field-header--uneditable table-title fields-width-117">Venta</td>}
            <td className="field-header--uneditable table-title fields-width-117">Porcentaje de descuento</td>
            <td className="field-header--uneditable table-title fields-width-117">Dto.</td>
            {isSupplierNote && <td className="field-header--uneditable table-title fields-width-117">Costo de envío</td>}
            <td className="field-header--uneditable table-title fields-width-117">Valor venta</td>
            <td className="field-header--uneditable table-title field-taxes">
                <div className="content-text-icon">
                    <p>Impuestos por unidad</p>
                    <TooltipTable
                        text={
                            <p className="text-sm text-gray-dark">
                                <span className="font-allerbold">Impuestos: </span>
                                Obligaciones tributarias que la persona o empresa deben pagar al estado.
                                <br />
                                Para saber más sobre impuestos haga click aca: &nbsp;
                                <Link
                                    href="https://www.dian.gov.co/Paginas/Vencimientos-tributarios-marzo-2024.aspx"
                                    text="Ver más...."
                                    linkColor={LinkColor.PURPLE}
                                    target="_blank"
                                    download
                                />
                            </p>
                        }
                    />
                </div>
            </td>
        </tr>
    );
};
