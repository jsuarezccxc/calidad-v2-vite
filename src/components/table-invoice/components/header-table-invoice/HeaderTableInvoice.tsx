import React from 'react';
import { useLocation } from 'react-router-dom';
import { BODY_TOOLTIP, TABLE_TOOLTIPS } from '@information-texts/TableInvoice';
import { TooltipTable } from '@components/tooltip-table';
import { IHeaderTableInvoiceProps, UTILS } from '.';
import './HeaderTableInvoice.scss';

export const HeaderTableInvoice: React.FC<IHeaderTableInvoiceProps> = ({ isMandate = false }) => {
    const { pathname, search } = useLocation();
    const { TOOLTIPS_PROPS } = UTILS;
    return (
        <tr className="header-table-note">
            <td className="table-checkbox w-7.5" />
            <td className="field-header--uneditable table-title field-record-index">No.</td>
            <td className="field-header--uneditable table-title field-sku">
                <div className="content-text-icon">
                    <TooltipTable
                        text={BODY_TOOLTIP(TABLE_TOOLTIPS.SKU)}
                        className="rounded material-tooltip"
                        {...TOOLTIPS_PROPS}
                    />
                    <p>*SKU/Código - Producto/Servicio</p>
                </div>
            </td>
            <td className="field-header--uneditable table-title field-description">
                <div className="content-text-icon">
                    <TooltipTable
                        text={BODY_TOOLTIP(TABLE_TOOLTIPS.DESCRIPTION)}
                        className="rounded material-tooltip"
                        {...TOOLTIPS_PROPS}
                    />
                    <p>Descripción</p>
                </div>
            </td>
            <td className="field-header--uneditable table-title fields-width-120">
                <div className="content-text-icon">
                    <TooltipTable
                        text={BODY_TOOLTIP(TABLE_TOOLTIPS.WAREHOUSE)}
                        className="rounded material-tooltip"
                        {...TOOLTIPS_PROPS}
                    />
                    <p>*Bodega</p>
                </div>
            </td>
            <td className="field-header--uneditable table-title fields-width-120">
                <div className="content-text-icon">
                    <TooltipTable
                        text={BODY_TOOLTIP(TABLE_TOOLTIPS.BATCH)}
                        className="rounded material-tooltip"
                        {...TOOLTIPS_PROPS}
                    />
                    <p>*Lote</p>
                </div>
            </td>
            <td className="field-header--uneditable table-title fields-width-120">
                <div className="content-text-icon">
                    <TooltipTable
                        text={BODY_TOOLTIP(TABLE_TOOLTIPS.DATE)}
                        className="rounded material-tooltip"
                        {...TOOLTIPS_PROPS}
                    />
                    <p>*Fecha de vencimiento</p>
                </div>
            </td>
            <td className="field-header--uneditable table-title fields-width-115">
                <div className="content-text-icon">
                    <TooltipTable
                        text={BODY_TOOLTIP(TABLE_TOOLTIPS.QUANTITY(UTILS.isSupportPage(pathname + search)))}
                        className="rounded material-tooltip"
                        {...TOOLTIPS_PROPS}
                    />
                    <p>Cantidad</p>
                </div>
            </td>
            <td className="field-header--uneditable table-title fields-width-120">
                <div className="content-text-icon">
                    <TooltipTable
                        text={BODY_TOOLTIP(TABLE_TOOLTIPS.UNIT_MEASUREMENT)}
                        className="rounded material-tooltip"
                        {...TOOLTIPS_PROPS}
                    />
                    <p>Unidad de medida</p>
                </div>
            </td>
            {isMandate && (
                <td className="field-header--uneditable table-title fields-mandate">
                    <div className="content-text-icon">
                        <TooltipTable
                            text={BODY_TOOLTIP(TABLE_TOOLTIPS.MANDATE)}
                            className="rounded material-tooltip"
                            {...TOOLTIPS_PROPS}
                        />
                        <p>*Proveedor o tercero</p>
                    </div>
                </td>
            )}
            <td className="field-header--uneditable table-title field-unit-value">
                <div className="content-text-icon">
                    <TooltipTable
                        text={BODY_TOOLTIP(TABLE_TOOLTIPS.UNIT_VALUE)}
                        className="rounded material-tooltip"
                        {...TOOLTIPS_PROPS}
                    />
                    <p>Valor unitario</p>
                </div>
            </td>
            <td className="field-header--uneditable table-title fields-width-120">
                <div className="content-text-icon">
                    <TooltipTable
                        text={BODY_TOOLTIP(TABLE_TOOLTIPS.PERCENTAGE_DISCOUNT)}
                        className="rounded material-tooltip"
                        {...TOOLTIPS_PROPS}
                    />
                    <p>% de descuento</p>
                </div>
            </td>
            <td className="field-header--uneditable table-title fields-width-120">
                <div className="content-text-icon">
                    <TooltipTable
                        text={BODY_TOOLTIP(TABLE_TOOLTIPS.DISCOUNT)}
                        className="rounded material-tooltip"
                        {...TOOLTIPS_PROPS}
                    />
                    <p>Descuento</p>
                </div>
            </td>
            <td className="field-header--uneditable table-title fields-width-115">
                <div className="content-text-icon">
                    <TooltipTable
                        text={BODY_TOOLTIP(TABLE_TOOLTIPS.TAXES)}
                        className="rounded material-tooltip"
                        {...TOOLTIPS_PROPS}
                    />
                    <p>Impuestos</p>
                </div>
            </td>
        </tr>
    );
};
