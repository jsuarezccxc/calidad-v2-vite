import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';

import information from '@assets/images/info-green.svg';

import { Table } from '@components/table';
import { Icon } from '@components/icon';
import { Tooltip } from '@components/tooltip';
import { Link, LinkColor } from '@components/button';
import { TableError } from '@components/table-error';
import { SingleCheckBox } from '@components/checkbox';
import { ChangeEvent, IOptionSelect, TextArea } from '@components/input';
import { IOption, SelectSearch } from '@components/select-search';
import { buildOptionsTable, ADD_PRODUCT_SERVICE, defaultPropsInputNumber } from '@components/table-invoice';
import { NumberFormatInput, PercentageFormatInput } from '@components/table-input';

import { Routes } from '@constants/Paths';
import { NA } from '@constants/ElectronicInvoice';
import { ADD_PRODUCT } from '@constants/AssembleProduct';
import { KEYS_ASSIGN_DETAIL } from '@constants/TableInvoice';

import usePopper from '@hooks/usePopper';
import usePermissions from '@hooks/usePermissions';

import { FieldName } from '@models/SalesInvoice';
import { IGenericRecord } from '@models/GenericRecord';
import { ITaxesProductsStock } from '@models/Inventory';
import { IInvoiceDetailCalculate, IInvoiceDetails } from '@models/ElectronicInvoice';

import { RootState } from '@redux/rootReducer';

import { getRoute } from '@utils/Paths';
import { assignValue } from '@utils/Json';
import { discountOfValue, isEven } from '@utils/Number';
import { multiOptionsSelect } from '@utils/ElectronicNote';
import { lengthEqualToZero, lengthGreaterThanZero } from '@utils/Length';
import {
    discardUntaxed,
    eventToNumber,
    stringToFloat,
    taxInformationForTables,
    unitCostToDetails,
    validateTypeProduct,
} from '@utils/ElectronicInvoice';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';

import { PRODUCT_TABLE_HEADERS, ITableDataProps, QUERY_FIELDS, FieldLength, calculateBase } from '.';

export const ProductsTable: React.FC<ITableDataProps> = ({
    data,
    symbol,
    validate,
    isMandate = false,
    errorMessages = [],
    foreignExchangeRate,
    perishableErrors = [],
    isPurchaseInvoice = false,
    updateData,
    toggleTotalsQuery,
}) => {
    const {
        products = [],
        suppliers: { data: suppliers } = { data: [] },
    } = useSelector(({ electronicInvoice, suppliers }: RootState) => ({
        ...electronicInvoice,
        ...suppliers,
    }));

    const { disabledInputs } = usePermissions();

    const addItem = (): void => updateData([...data, { ...ADD_PRODUCT_SERVICE, id: uuid() }]);

    const deleteRow = (): void => {
        updateData(data.filter(item => !item.checked));
        toggleTotalsQuery();
    };

    const handleSelectionRow = ({ target: { checked } }: ChangeEvent, row: number): void => {
        updateData(data.map((item, index) => ({ ...item, ...(index === row && { checked }) })));
    };

    const handleDataChange = ({ target: { name, value } }: IGenericRecord, field: number): void => {
        updateData(
            data.map((item, index) => {
                const newItem = { ...item, ...(index === field && { [name]: value }) };
                return {
                    ...newItem,
                    ...((name === FieldName.DiscountPercentage || name === FieldName.Quantity || name === FieldName.UnitCost) &&
                        getCalculate(newItem)),
                };
            })
        );
        if (QUERY_FIELDS.includes(name)) toggleTotalsQuery();
    };

    const getCalculate = ({ unit_cost = 0, quantity = 0, percentage_discount = 0 }: IInvoiceDetails): IInvoiceDetailCalculate => {
        const unitValue = stringToFloat(unit_cost) * stringToFloat(quantity);
        const discount = discountOfValue(unitValue, percentage_discount) || 0;
        return {
            discount,
            unit_cost,
            unit_value: unitValue,
            total_buy: unitValue - discount,
        };
    };

    const handleSkuChange = ({ option: { value, ...option } }: IGenericRecord, field: number): void => {
        const productFound = products.find(product => product.sku_internal === option.name || product.id === value) || {};
        const uniqueProductTaxes = discardUntaxed(productFound.unique_product_taxes);
        let unit_value = unitCostToDetails(productFound, uniqueProductTaxes);
        if (foreignExchangeRate) unit_value = unit_value / stringToFloat(foreignExchangeRate);
        updateData(
            data.map((item, index) =>
                index === field
                    ? {
                          ...item,
                          ...validateTypeProduct(productFound),
                          ...assignValue(KEYS_ASSIGN_DETAIL, productFound),
                          quantity: 0,
                          discount: 0,
                          percentage_discount: 0,
                          unit_value,
                          sale: unit_value,
                          unit_cost: unit_value,
                          total_buy: unit_value,
                          product_taxes: uniqueProductTaxes,
                          taxes: uniqueProductTaxes.map(({ company_tax_id, tax_value }) => ({ company_tax_id, tax_value })) || [],
                      }
                    : item
            )
        );
    };

    const changeDynamicOption = ({ option: { value, name, ...option }, name: field }: IGenericRecord, index: number): void => {
        updateData(
            data.map((item, indexMap) => {
                if (index === indexMap) {
                    const {
                        multiBatch: [batches],
                        batchDetailId,
                    } = multiOptionsSelect(
                        products,
                        [{ ...item, [`${field}_id`]: value }],
                        'unique_products_id',
                        field === 'warehouse'
                    );
                    return {
                        ...item,
                        ...(FieldName.ExpirationDate === field && { [field]: name }),
                        ...(field === FieldName.Supplier && {
                            mandate_id: value,
                            mandate: option.mandate || suppliers.find((s: IGenericRecord) => s.id === value) || {},
                        }),

                        ...(FieldName.Batch === field && {
                            batch_id: value,
                            batch_number: name,
                            batch_detail_id: batchDetailId,
                        }),
                        ...(FieldName.Warehouse === field &&
                            lengthEqualToZero(batches) && {
                                batch_number: NA,
                                date_expiration: NA,
                            }),
                        [`${field}_id`]: value,
                        [`${field}_name`]: name,
                    };
                }
                return item;
            })
        );
    };

    const handleTextArea = ({ target: { name, value } }: ChangeEvent, row: number): void => {
        const update = data.map((item, index) => {
            if (index !== row) return item;
            return {
                ...item,
                [name]: value,
            };
        });
        updateData(update);
    };

    const selectSearchOptions = ({ value, id = '' }: IOptionSelect): IOption => ({ name: value, value: id });

    const optionsAssign = (options: IOption[], item: IInvoiceDetails, key: string): IOption[] => {
        if (
            item[`${key}_id` as keyof IInvoiceDetails] &&
            !options.some(option => option.value === item[`${key}_id` as keyof IInvoiceDetails])
        )
            return [...options].concat(
                key === FieldName.Warehouse
                    ? { name: String(item.warehouse_name), value: String(item.warehouse_id) }
                    : { name: String(item.batch_number), value: String(item.batch_id) }
            );
        return options;
    };

    const options = useMemo(() => buildOptionsTable({ products, suppliers, noteDetails: data, invoiceDetails: [] }), [
        products,
        data,
        suppliers,
    ]);

    return (
        <div id="tableInvoice" className="products-table">
            <Icon
                id={generateId({
                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                    submodule: `${ModuleApp.ELECTRONIC_INVOICE}-product-service`,
                    action: ActionElementType.DELETE,
                    elementType: ElementType.ICO,
                })}
                className="w-5.5 h-5.5 mb-2 ml-auto"
                hoverIcon="trashGreen"
                name="trashBlue"
                onClick={deleteRow}
            />
            <Table
                id={generateId({
                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                    submodule: `${ModuleApp.ELECTRONIC_INVOICE}-products`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.TBL,
                })}
                headerRowsCustom={<ProductTableHeader isMandate={isMandate} isPurchaseInvoice={isPurchaseInvoice} />}
                className={`${errorMessages.length ? 'mb-2' : ''} products-table__table`}
                tbodyClassName="products-table__table"
                theadClassName="products-table__table"
                idContentTable="mondaMonda"
                wrapperClassName="w-full"
                isHeaderRowsCustom
                customTable
                data={[]}
                isNew
                sendFormWithEnter
            >
                {data.map((item, index) => (
                    <tr
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `${ModuleApp.ELECTRONIC_INVOICE}-product-${index}`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.ROW,
                        })}
                        className={`${isEven(index + 1) ? 'bg-gray-light' : 'bg-white'}`}
                        key={index}
                    >
                        <td className="products-table__border-none table-field">
                            <SingleCheckBox
                                checked={item.checked}
                                handleChange={(e: ChangeEvent): void => handleSelectionRow(e, index)}
                                name="checked"
                            />
                        </td>
                        <td className="table-field">{index + 1}</td>
                        <td className={`table-field ${validate && !item.sku_internal ? 'table-field--required' : ''}`}>
                            <SelectSearch
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `${ModuleApp.ELECTRONIC_INVOICE}-product-${index}-sku`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.ROW,
                                })}
                                options={[
                                    ...options.sku,
                                    ...(item.sku_internal
                                        ? [{ name: `${item.sku_internal} - ${item.unique_product_name}`, value: item.id }]
                                        : []),
                                ]}
                                value={item.id}
                                name="sku_internal"
                                selectIconType="arrowDownGreen"
                                className="products-table__select"
                                onChange={(option, name): void => handleSkuChange({ option, name }, index)}
                            />
                        </td>
                        <td className="table-field">
                            <TextArea
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `${ModuleApp.ELECTRONIC_INVOICE}-product-${index}-description`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.ROW,
                                })}
                                onChange={(e): void => handleTextArea(e, index)}
                                value={item.description}
                                name="description"
                                isTable
                            />
                        </td>
                        <td className={`table-field ${validate && !item.warehouse_name ? 'table-field--required' : ''}`}>
                            {item.warehouse_name !== NA ? (
                                <SelectSearch
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `${ModuleApp.ELECTRONIC_INVOICE}-product-${index}-warehouse`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.ROW,
                                    })}
                                    onChange={(option, name): void => changeDynamicOption({ option, name }, index)}
                                    options={optionsAssign(
                                        options.warehouse[index]?.map(selectSearchOptions),
                                        item,
                                        FieldName.Warehouse
                                    )}
                                    className="products-table__select"
                                    value={item.warehouse_id || ''}
                                    selectIconType="arrowDownGreen"
                                    name="warehouse"
                                />
                            ) : (
                                <p className="px-2 text-gray text-tiny lg:text-sm">{NA}</p>
                            )}
                        </td>
                        <td className={`table-field ${validate && !item.batch_number ? 'table-field--required' : ''}`}>
                            {item.batch_number !== NA ? (
                                <SelectSearch
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `${ModuleApp.ELECTRONIC_INVOICE}-product-${index}-batch`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.ROW,
                                    })}
                                    options={optionsAssign(options.batch[index]?.map(selectSearchOptions), item, FieldName.Batch)}
                                    value={item.batch_id || ''}
                                    onChange={(option, name): void => {
                                        changeDynamicOption({ option, name }, index);
                                    }}
                                    selectIconType="arrowDownGreen"
                                    name="batch"
                                    className="products-table__select"
                                />
                            ) : (
                                <p className="px-2 text-gray text-tiny lg:text-sm">{NA}</p>
                            )}
                        </td>
                        <td className={`table-field ${validate && !item?.date_expiration ? 'table-field--required' : ''}`}>
                            {item.date_expiration !== NA ? (
                                <SelectSearch
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `${ModuleApp.ELECTRONIC_INVOICE}-product-${index}-date-exp`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.ROW,
                                    })}
                                    options={options.date[index]?.map(selectSearchOptions)}
                                    value={item.date_expiration || ''}
                                    onChange={(option, name): void => changeDynamicOption({ option, name }, index)}
                                    className="products-table__select"
                                    selectIconType="arrowDownGreen"
                                    name="date_expiration"
                                    disableSearch
                                />
                            ) : (
                                <p className="px-2 text-gray text-tiny lg:text-sm">{NA}</p>
                            )}
                        </td>
                        <td className={`table-field ${validate && !item?.quantity ? 'table-field--required' : ''}`}>
                            <NumberFormatInput
                                {...defaultPropsInputNumber}
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `${ModuleApp.ELECTRONIC_INVOICE}-product-${index}-quantity`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.ROW,
                                })}
                                name="quantity"
                                value={item.quantity}
                                inputClass="lg:h-auto"
                                disabled={!item?.sku_internal}
                                handleChange={(e): void => handleDataChange(e, index)}
                            />
                        </td>
                        <td className="table-field">{item?.unit_measurement_name}</td>
                        {isMandate && (
                            <td className={`table-field  ${validate && !item.mandate_id ? 'table-field--required' : ''}`}>
                                <SelectSearch
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `${ModuleApp.ELECTRONIC_INVOICE}-product-${index}-supplier`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.ROW,
                                    })}
                                    options={options.suppliers?.map(selectSearchOptions)}
                                    value={item.mandate_id || ''}
                                    onChange={(option): void => {
                                        const mandate =
                                            suppliers.find((supplier: IGenericRecord) => supplier.id === option.value) || {};
                                        changeDynamicOption(
                                            {
                                                option: { ...option, name: option.name },
                                                name: FieldName.Supplier,
                                                mandate,
                                            },
                                            index
                                        );
                                    }}
                                    className="products-table__select"
                                    selectIconType="arrowDownGreen"
                                    name="mandate"
                                />
                            </td>
                        )}
                        <td className={`table-field ${validate && !item.unit_cost ? 'table-field--required' : ''}`}>
                            <NumberFormatInput
                                {...defaultPropsInputNumber}
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `${ModuleApp.ELECTRONIC_INVOICE}-product-${index}-unit-value`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.ROW,
                                })}
                                prefix={symbol}
                                value={item.unit_cost}
                                name={FieldName.UnitCost}
                                disabled={!isPurchaseInvoice}
                                maxLength={FieldLength.UnitValue}
                                handleChange={(e): void => handleDataChange(e, index)}
                            />
                        </td>
                        <td className="table-field">
                            <PercentageFormatInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `${ModuleApp.ELECTRONIC_INVOICE}-product-${index}-percentage-discount`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.ROW,
                                })}
                                handleChange={({ target }): void => {
                                    handleDataChange(
                                        {
                                            target: {
                                                name: FieldName.DiscountPercentage,
                                                value: eventToNumber(target.value.replaceAll('%', '')).floatValue,
                                            },
                                        },
                                        index
                                    );
                                }}
                                disabled={!item.sku_internal}
                                value={item.percentage_discount}
                                maxLength={FieldLength.DiscountPercentage}
                            />
                        </td>
                        <td className="table-field">
                            <NumberFormatInput
                                {...defaultPropsInputNumber}
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `${ModuleApp.ELECTRONIC_INVOICE}-product-${index}-discount`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.ROW,
                                })}
                                disabled
                                name="discount"
                                prefix={symbol}
                                value={item.discount}
                                inputClass="text-gray"
                                maxLength={FieldLength.Discount}
                            />
                        </td>
                        <td className="table-field">
                            <div className="flex flex-col gap-y-2">
                                {lengthGreaterThanZero(item.product_taxes) ? (
                                    item.product_taxes.map((tax: ITaxesProductsStock, index: number) => (
                                        <p className="text-gray-dark text-tiny lg:text-sm" key={index}>
                                            {tax.tax_name}: &nbsp; {symbol} &nbsp;
                                            {taxInformationForTables(tax, {
                                                quantity: stringToFloat(item.quantity),
                                                sale_value: calculateBase(item),
                                            })}
                                        </p>
                                    ))
                                ) : (
                                    <p className="text-sm text-left text-gray">{NA}</p>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
            </Table>
            {validate && [...errorMessages, ...perishableErrors].map(error => <TableError key={error} customText={error} />)}
            <button
                id={generateId({
                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                    submodule: `${ModuleApp.ELECTRONIC_INVOICE}-product-service`,
                    action: ActionElementType.ADD,
                    elementType: ElementType.BTN,
                })}
                className={`mt-2 underline cursor-pointer ${disabledInputs ? 'text-gray' : 'text-green'} mb-4.5`}
                onClick={addItem}
                disabled={disabledInputs}
            >
                + Agregar producto/servicio a la factura
            </button>
            <p className="text-blue my-4.5">
                Si no ha agregado un producto/servicio a su catálogo, &nbsp;
                <Link
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `${ModuleApp.ELECTRONIC_INVOICE}-new-product-service`,
                        action: ActionElementType.ADD,
                        elementType: ElementType.LNK,
                    })}
                    classes="text-base"
                    href={`${getRoute(Routes.PRODUCT_DATABASE)}?${ADD_PRODUCT}=true`}
                    linkColor={LinkColor.PURPLE}
                    text="haga click aquí."
                />
            </p>
        </div>
    );
};

const ProductTableHeader: React.FC<{ isMandate: boolean; isPurchaseInvoice: boolean }> = ({ isMandate, isPurchaseInvoice }) => {
    return (
        <tr className="bg-green-extraLight">
            {PRODUCT_TABLE_HEADERS(isMandate, isPurchaseInvoice).map(({ className, title, tooltip }) => (
                <th key={className} className={`table-head products-table__${className}`}>
                    <Information title={title} tooltip={tooltip} />
                </th>
            ))}
        </tr>
    );
};

const Information: React.FC<IGenericRecord> = ({ tooltip, title }) => {
    const { anchorEl, mouseProps } = usePopper();
    return (
        <div className="text-tiny lg:text-sm flex gap-0.5 items-center">
            <p {...mouseProps}>
                {tooltip && (
                    <>
                        <img alt="Information" className="products-table__icon" src={information} />
                        <Tooltip anchorEl={anchorEl} placement="bottom" iconName="infoBlue" {...tooltip} />
                    </>
                )}
            </p>
            <span className="text-left leading-stiny">{title}</span>
        </div>
    );
};
