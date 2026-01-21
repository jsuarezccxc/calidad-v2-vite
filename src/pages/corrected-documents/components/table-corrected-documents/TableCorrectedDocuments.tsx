import React, { useMemo } from 'react';
import { calculateTotal } from '@utils/Calculate';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { Table } from '@components/table';
import { TooltipTable } from '@components/tooltip-table';
import { NumberFormatInput, Title } from '@components/table-input';
import { BODY_TOOLTIP } from '@information-texts/TableInvoice';
import { TOOLTIPS_TABLE } from '@information-texts/CorrectedDocuments';
import { IPropsFooterCorrected, IPropsHeaderCorrected, IPropsTableCorrected, utils } from '.';
import './TableCorrectedDocuments.scss';

const HeaderTable: React.FC<IPropsHeaderCorrected> = ({ title }) => {
    return (
        <tr>
            <td className="field-header--uneditable table-corrected-documents__header__field-with-210">
                <Title
                    className="table-corrected-documents__header__title"
                    text="Número de documento electrónico"
                    disabled
                    isNew
                />
            </td>
            <td className="field-header--uneditable table-corrected-documents__header w-37">
                <div className="table-corrected-documents__header__content-text-icon">
                    <TooltipTable
                        text={BODY_TOOLTIP(TOOLTIPS_TABLE.DATE)}
                        className="rounded material-tooltip"
                        disabledDefinitionSection
                    />
                    <p>Fecha de transmisión</p>
                </div>
            </td>
            <td className="field-header--uneditable table-corrected-documents__header w-37">
                <Title text={title} disabled isNew className="table-corrected-documents__header__title" />
            </td>
            <td className="field-header--uneditable table-corrected-documents__header w-37">
                <Title text="Unidades vendidas" disabled isNew className="table-corrected-documents__header__title" />
            </td>
            <td className="field-header--uneditable table-corrected-documents__header w-37">
                <div className="table-corrected-documents__header__content-text-icon">
                    <TooltipTable
                        text={BODY_TOOLTIP(TOOLTIPS_TABLE.SALE)}
                        className="rounded material-tooltip"
                        disabledDefinitionSection
                    />
                    <p>Total venta</p>
                </div>
            </td>
            <td className="field-header--uneditable table-corrected-documents__header width--response">
                <Title text="Respuesta DIAN" disabled isNew className="table-corrected-documents__header__title" />
            </td>
            <td className="field-header--uneditable table-corrected-documents__header width--response">
                <Title text="Respuesta Cliente" disabled isNew className="table-corrected-documents__header__title" />
            </td>
        </tr>
    );
};

const FooterTable: React.FC<IPropsFooterCorrected> = ({ TotalSale, totalNotes, totalQuantities }) => {
    return (
        <tr>
            <td className="px-2 py-1 bg-white font-allerbold field-body--uneditable table-corrected-documents__header__field-with-210">
                <div className="flex">
                    <Title text="Total documentos electrónicos" isNew disabled />
                    <NumberFormatInput
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `corrected-total-notes`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.TXT,
                        })}
                        inputClass="table-corrected-documents__body__number table-corrected-documents__color-blue"
                        containerClass="w-11"
                        value={totalNotes}
                        withIcon={false}
                        disabled
                    />
                </div>
            </td>
            <td className="bg-white font-allerbold field-body--uneditable"></td>
            <td className="bg-white font-allerbold field-body--uneditable"></td>
            <td className="bg-white font-allerbold field-body--uneditable w-37">
                <NumberFormatInput
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `corrected-total-quantities`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.TXT,
                    })}
                    inputClass="table-corrected-documents__body__number table-corrected-documents__color-blue"
                    containerClass="px-2"
                    value={totalQuantities}
                    withIcon={false}
                    disabled
                />
            </td>
            <td className="bg-white font-allerbold field-body--uneditable w-37">
                <NumberFormatInput
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `corrected-total-sales`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.TXT,
                    })}
                    inputClass="table-corrected-documents__body__number table-corrected-documents__color-blue"
                    containerClass="px-2"
                    value={TotalSale}
                    fixedDecimalScale
                    disabled
                    withIcon
                    isTable
                />
            </td>
            <td colSpan={2} className="bg-white font-allerbold field-body--uneditable" />
        </tr>
    );
};

export const TableCorrectedDocuments: React.FC<IPropsTableCorrected> = ({ props, isLoadingTable }) => {
    const { data } = props;
    const propsHeaderFooter = useMemo(
        () => ({
            title: utils.headerTitle(data),
            totalNotes: data.length,
            totalQuantities: calculateTotal(data.map(({ number_sold }) => number_sold)),
            TotalSale: calculateTotal(data.map(({ total }) => total)),
        }),
        [data]
    );

    return (
        <>
            <Table
                id={generateId({
                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                    submodule: `corrected`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.TBL,
                })}
                isLoading={isLoadingTable}
                headerRowsCustom={<HeaderTable {...propsHeaderFooter} />}
                footerRowsCustom={<FooterTable {...propsHeaderFooter} />}
                fieldsBody={utils.fieldsBody()}
                className="w-max"
                isHeaderRowsCustom
                isFooterRowsCustom
                data={data}
                paginatorBackendData={props}
                isNew
            />
        </>
    );
};
