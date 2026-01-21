import React, { useEffect, ChangeEvent } from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import { ITaxesProductsStock } from '@models/Inventory';
import { IInvoiceDetails } from '@models/ElectronicInvoice';
import usePermissions from '@hooks/usePermissions';
import usePaginator from '@hooks/usePaginator';
import useSelectSearch from '@hooks/useSelectSearch';
import { lengthGreaterThanZero } from '@utils/Length';
import { getChecked, handleChecked } from '@utils/Checkboxs';
import { buildOptionsToOptionsSearch } from '@utils/Company';
import { includeArray, sortArrayAlphabetically } from '@utils/Array';
import { defaultPercentageInput, stringToFloat, taxInformationForTables, eventToNumber } from '@utils/ElectronicInvoice';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { PERCENTAGE } from '@constants/Tax';
import { ITEMS_PAGE } from '@constants/Paginator';
import { InvoiceTableKeys } from '@constants/TableInvoice';
import { MaxLengthFields, NA } from '@constants/ElectronicInvoice';
import { DETAILS_INVOICE } from '@information-texts/TableInvoice';
import { Icon } from '@components/icon';
import { Table } from '@components/table';
import { LinkAdd } from '@components/button';
import { Checkbox } from '@components/checkbox';
import { Paginator } from '@components/paginator';
import { TableError } from '@components/table-error';
import { COMMA } from '@components/electronic-invoice';
import { SelectSearch } from '@components/select-search';
import { NotFindElements } from '@components/not-find-elements';
import { NumberFormatInput, PercentageFormatInput, Text, TextArea } from '@components/table-input';
import { HeaderTableInvoice } from './components/header-table-invoice';
import { ITableInvoiceProps, defaultPropsInputNumber } from '.';
import './TableInvoice.scss';

export const TableInvoice: React.FC<ITableInvoiceProps> = ({
    id = '',
    data,
    symbol,
    options,
    selected,
    setSelected,
    redirectRoute,
    onChangeTable,
    deleteProduct,
    addProductService,
    showAddProduct,
    isMandate = false,
    className = '',
    warningsStock = [],
    requiredFieldsTable: { fields, messages } = { fields: [], messages: [] },
}) => {
    const { SKU, BATCH, DATE, PERCENTAGE_DISCOUNT, QUANTITY, UNIT_COST, WAREHOUSE, MANDATE } = InvoiceTableKeys;

    const { disabledInputs } = usePermissions();
    const { toggleSelectSearch } = useSelectSearch();
    const { paginator, getLimits } = usePaginator(data);

    useEffect(() => {
        getLimits();
    }, [data]);

    const optionsSuppliersRender = options.suppliers.map(item => ({ ...item, name: item.value }));

    return (
        <div className={`flex flex-col ${className}`}>
            <p className="text-blue text-tiny">{DETAILS_INVOICE.DESCRIPTION_TABLE}</p>
            <div className="flex flex-col my-4.5">
                <Icon
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `${ModuleApp.TABLE}-invoice`,
                        action: ActionElementType.DELETE,
                        elementType: ElementType.ICO,
                    })}
                    name="trashBlue"
                    hoverIcon="trashGreen"
                    className="self-end mb-2"
                    onClick={!disabledInputs ? deleteProduct : (): void => {}}
                />
                <Table
                    id={id}
                    headerRowsCustom={<HeaderTableInvoice isMandate={isMandate} />}
                    onScroll={(): void => toggleSelectSearch(false)}
                    idContentTable="tableNote"
                    className="table-invoice"
                    isHeaderRowsCustom
                    customTable
                    data={[]}
                    isNew
                    disabled={disabledInputs}
                    editable={!disabledInputs}
                    sendFormWithEnter
                >
                    {data
                        .slice(paginator?.limits.start, paginator?.limits.finish)
                        ?.map((item: IInvoiceDetails, index: number) => {
                            const optionSku = [
                                ...options.sku,
                                ...(item.sku_internal
                                    ? [
                                          {
                                              name: `${item.sku_internal} - ${item.unique_product_name}`,
                                              value: item.unique_products_id,
                                          },
                                      ]
                                    : []),
                            ];
                            const disabledWarehouse = String(item.warehouse_name).includes(NA);
                            const disabledBatch = String(item.batch_number).includes(NA);
                            const disabledDate = String(item.date_expiration).includes(NA);

                            return (
                                <tr
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `${ModuleApp.TABLE}-invoice-item-${index}`,
                                        action: ActionElementType.INFO,
                                        elementType: ElementType.ROW,
                                    })}
                                    key={`documents-${index}`}
                                    className="lg:h-10 h-8.2"
                                >
                                    <td className="td-checkbox">
                                        <Checkbox
                                            id={generateId({
                                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                submodule: `${ModuleApp.TABLE}-invoice-item-${index + 1}`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.CHK,
                                            })}
                                            checked={
                                                item.checked
                                                    ? item.checked
                                                    : getChecked(String(item.id || item.unique_products_id), selected)
                                            }
                                            onChange={(): void =>
                                                handleChecked(
                                                    item,
                                                    selected,
                                                    setSelected as React.Dispatch<React.SetStateAction<IGenericRecord[]>>
                                                )
                                            }
                                            disabled={disabledInputs}
                                            classContainer="w-max p-0 mr-2"
                                            name="check"
                                        />
                                    </td>
                                    <td className="border-b without-padding-body field-body--uneditable">
                                        <Text
                                            text={String(index + 1)}
                                            className="text-gray"
                                            editTable={false}
                                            name="number"
                                            type="text"
                                            disabled
                                        />
                                    </td>
                                    <td
                                        className={`without-padding-body field-body--uneditable border-b ${
                                            includeArray(fields[index], SKU) ? 'table-invoice--required' : ''
                                        }`}
                                    >
                                        <SelectSearch
                                            id={generateId({
                                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                submodule: `${ModuleApp.TABLE}-invoice-item-${index}-sku`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.DRP,
                                            })}
                                            onChange={(target): void =>
                                                onChangeTable({
                                                    index,
                                                    target,
                                                    field: SKU,
                                                })
                                            }
                                            options={sortArrayAlphabetically(optionSku)}
                                            selectIconType="arrowDownGreen"
                                            inputClass="select-search"
                                            className="lg:h-10 h-8.2"
                                            value={item.unique_products_id}
                                            name={`sku-${index}`}
                                            disabled={disabledInputs}
                                        />
                                    </td>
                                    <td className="border-b without-padding-body field-body--uneditable">
                                        <TextArea
                                            id={generateId({
                                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                submodule: `${ModuleApp.TABLE}-invoice-item-${index}-description`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.DRP,
                                            })}
                                            onChange={({ target }: ChangeEvent<HTMLInputElement>): void =>
                                                onChangeTable({
                                                    index,
                                                    target,
                                                    field: InvoiceTableKeys.DESCRIPTION,
                                                })
                                            }
                                            classesWrapper="xs:h-7.125 px-1 xs:overflow-auto"
                                            maxLength={MaxLengthFields.DESCRIPTION}
                                            classesInput="body__text-description"
                                            value={item.description || ''}
                                            disabled={disabledInputs}
                                            isTable
                                        />
                                    </td>
                                    <td
                                        className={`without-padding-body field-body--uneditable border-b ${
                                            includeArray(fields[index], WAREHOUSE) ? 'table-invoice--required' : ''
                                        }`}
                                    >
                                        {disabledWarehouse ? (
                                            <p className="text-NA">{NA}</p>
                                        ) : (
                                            <SelectSearch
                                                id={generateId({
                                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                    submodule: `${ModuleApp.TABLE}-invoice-item-${index}-warehouse`,
                                                    action: ActionElementType.INPUT,
                                                    elementType: ElementType.DRP,
                                                })}
                                                onChange={(target): void => onChangeTable({ target, index, field: WAREHOUSE })}
                                                selectIconType={disabledWarehouse ? 'arrowDownGray' : 'arrowDownGreen'}
                                                options={buildOptionsToOptionsSearch(options.warehouse[index])}
                                                disabled={disabledWarehouse || disabledInputs}
                                                inputClass="text-gray-dark text-sm text-left"
                                                value={item.warehouse_id || ''}
                                                className="justify-center"
                                            />
                                        )}
                                    </td>
                                    <td
                                        className={`without-padding-body field-body--uneditable border-b ${
                                            includeArray(fields[index], BATCH) ? 'table-invoice--required' : ''
                                        }`}
                                    >
                                        {disabledBatch ? (
                                            <p className="text-NA">{NA}</p>
                                        ) : (
                                            <SelectSearch
                                                id={generateId({
                                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                    submodule: `${ModuleApp.TABLE}-invoice-item-${index}-batch`,
                                                    action: ActionElementType.INPUT,
                                                    elementType: ElementType.DRP,
                                                })}
                                                onChange={(target): void => onChangeTable({ target, index, field: BATCH })}
                                                selectIconType={disabledBatch ? 'arrowDownGray' : 'arrowDownGreen'}
                                                options={buildOptionsToOptionsSearch(options.batch[index])}
                                                disabled={disabledBatch || disabledInputs}
                                                inputClass="text-gray-dark text-sm"
                                                value={item.batch_id || ''}
                                                className="justify-center"
                                            />
                                        )}
                                    </td>
                                    <td
                                        className={`without-padding-body field-body--uneditable border-b ${
                                            includeArray(fields[index], DATE) ? 'table-invoice--required' : ''
                                        }`}
                                    >
                                        {disabledDate ? (
                                            <p className="text-NA">{NA}</p>
                                        ) : (
                                            <SelectSearch
                                                id={generateId({
                                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                    submodule: `${ModuleApp.TABLE}-invoice-item-${index}-exp-date`,
                                                    action: ActionElementType.INPUT,
                                                    elementType: ElementType.DRP,
                                                })}
                                                onChange={(target): void => onChangeTable({ target, index, field: DATE })}
                                                selectIconType={disabledDate ? 'calendarGray' : 'calendarGreen'}
                                                options={buildOptionsToOptionsSearch(options.date[index])}
                                                disabled={disabledDate || disabledInputs}
                                                inputClass="text-gray-dark text-sm"
                                                value={item.date_expiration || ''}
                                                className="justify-center"
                                            />
                                        )}
                                    </td>
                                    <td
                                        className={`without-padding-body field-body--uneditable border-b ${
                                            includeArray(fields[index], QUANTITY) ? 'table-invoice--required' : ''
                                        }`}
                                    >
                                        <NumberFormatInput
                                            id={generateId({
                                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                submodule: `${ModuleApp.TABLE}-invoice-item-${index}-quantity`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.TXT,
                                            })}
                                            {...defaultPropsInputNumber}
                                            handleChange={({ target: { value } }): void =>
                                                onChangeTable({ target: eventToNumber(value), index, field: QUANTITY })
                                            }
                                            disabled={disabledInputs}
                                            value={item.quantity}
                                        />
                                    </td>
                                    <td className="border-b without-padding-body field-body--uneditable">
                                        <Text
                                            className="w-full text-gray height-auto body__margin-input"
                                            text={item.unit_measurement_name}
                                            name="measurement"
                                            editTable={false}
                                            type="text"
                                            disabled
                                        />
                                    </td>
                                    {isMandate && (
                                        <td
                                            className={`without-padding-body field-body--uneditable border-b ${
                                                includeArray(fields[index], MANDATE) ? 'table-invoice--required' : ''
                                            }`}
                                        >
                                            <SelectSearch
                                                id={generateId({
                                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                    submodule: `${ModuleApp.TABLE}-invoice-item-${index}-mandate`,
                                                    action: ActionElementType.INPUT,
                                                    elementType: ElementType.DRP,
                                                })}
                                                onChange={(target): void => onChangeTable({ target, index, field: MANDATE })}
                                                className="justify-center without-padding-body"
                                                inputClass="text-gray-dark text-sm"
                                                selectIconType="arrowDownGreen"
                                                options={optionsSuppliersRender}
                                                value={item.mandate?.name}
                                                disabled={disabledInputs}
                                                name="mandate"
                                            />
                                        </td>
                                    )}
                                    <td
                                        className={`without-padding-body field-body--uneditable border-b ${
                                            includeArray(fields[index], UNIT_COST) ? 'table-invoice--required' : ''
                                        }`}
                                    >
                                        <NumberFormatInput
                                            id={generateId({
                                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                submodule: `${ModuleApp.TABLE}-invoice-item-${index}-unit-cost`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.TXT,
                                            })}
                                            {...defaultPropsInputNumber}
                                            handleChange={({ target: { value } }): void =>
                                                onChangeTable({ target: eventToNumber(value), index, field: UNIT_COST })
                                            }
                                            disabled={disabledInputs}
                                            value={item.unit_cost}
                                            prefix={symbol}
                                        />
                                    </td>
                                    <td
                                        className={` without-padding-body field-body--uneditable border-b ${
                                            includeArray(fields[index], PERCENTAGE_DISCOUNT) ? 'table-invoice--required' : ''
                                        }`}
                                    >
                                        <PercentageFormatInput
                                            id={generateId({
                                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                submodule: `${ModuleApp.TABLE}-invoice-item-${index}-percent-discount`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.TXT,
                                            })}
                                            onKeyPress={(e): void => {
                                                if (e.code !== COMMA && e.currentTarget.value === PERCENTAGE.ZERO) {
                                                    onChangeTable({
                                                        index,
                                                        field: PERCENTAGE_DISCOUNT,
                                                        target: defaultPercentageInput(PERCENTAGE_DISCOUNT, undefined),
                                                    });
                                                }
                                            }}
                                            onBlur={(e): void => {
                                                if (e.target.value) return;
                                                onChangeTable({ target: eventToNumber('0'), index, field: PERCENTAGE_DISCOUNT });
                                            }}
                                            handleChange={({ target: { value } }): void =>
                                                onChangeTable({
                                                    index,
                                                    field: PERCENTAGE_DISCOUNT,
                                                    target: eventToNumber(value.replaceAll('%', '')),
                                                })
                                            }
                                            value={item.percentage_discount}
                                            inputClass="number-input-style"
                                            disabled={disabledInputs}
                                        />
                                    </td>
                                    <td className="border-b without-padding-body field-body--uneditable">
                                        <NumberFormatInput
                                            id={generateId({
                                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                submodule: `${ModuleApp.TABLE}-invoice-item-${index}-discount`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.TXT,
                                            })}
                                            {...defaultPropsInputNumber}
                                            inputClass={`${defaultPropsInputNumber.inputClass} text-gray`}
                                            value={item.discount}
                                            prefix={symbol}
                                            disabled
                                        />
                                    </td>
                                    <td className="border-b without-padding-body field-body--uneditable">
                                        {lengthGreaterThanZero(item.product_taxes) ? (
                                            item.product_taxes.map((tax: ITaxesProductsStock, tax_index: number) => (
                                                <p
                                                    id={generateId({
                                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                        submodule: `${ModuleApp.TABLE}-invoice-item-${index}-taxes-${
                                                            tax.tax_name
                                                        }-${tax_index + 1}`,
                                                        action: ActionElementType.INPUT,
                                                        elementType: ElementType.TXT,
                                                    })}
                                                    key={index}
                                                    className="text-sm text-left xs:text-tiny text-gray"
                                                >
                                                    {tax.tax_name}: &nbsp; {symbol} &nbsp;
                                                    {taxInformationForTables(tax, {
                                                        quantity: stringToFloat(item.quantity),
                                                        sale_value: item.total_buy,
                                                    })}
                                                </p>
                                            ))
                                        ) : (
                                            <p className="text-sm text-left text-gray">{NA}</p>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                </Table>
                {!lengthGreaterThanZero(data) && <NotFindElements customText={DETAILS_INVOICE.NOT_ELEMENTS} withoutData />}
                {data.length > ITEMS_PAGE && <Paginator {...paginator} />}
                {messages.map((message, index) => (
                    <TableError key={index} customText={message} />
                ))}
                {warningsStock.map((message, index) => {
                    <TableError key={index} customText={message} />;
                })}
            </div>
            {showAddProduct && (
                <LinkAdd
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `${ModuleApp.TABLE}-invoice-product-service`,
                        action: ActionElementType.ADD,
                        elementType: ElementType.LNK,
                    })}
                    text="+Agregar producto/servicio"
                    classes="text-base mb-4.5 w-auto"
                    onClick={addProductService}
                    disabled={disabledInputs}
                />
            )}
            <p className="leading-19.38px mb-4.5">{DETAILS_INVOICE.REDIRECT_TEXT(redirectRoute)}</p>
        </div>
    );
};
