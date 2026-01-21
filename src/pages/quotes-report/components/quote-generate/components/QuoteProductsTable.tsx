import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { Link, LinkColor } from '@components/button';
import { SingleCheckBox } from '@components/checkbox';
import { Icon } from '@components/icon';
import { ChangeEvent, IOptionSelect, TextArea } from '@components/input';
import { IOption, SelectSearch } from '@components/select-search';
import { Table } from '@components/table';
import { TableError } from '@components/table-error';
import { NumberFormatInput, PercentageFormatInput } from '@components/table-input';
import { ADD_PRODUCT_SERVICE, buildOptionsTable, defaultPropsInputNumber } from '@components/table-invoice';
import { Tooltip } from '@components/tooltip';
import { ADD_PRODUCT } from '@constants/AssembleProduct';
import { IVA } from '@constants/BuildProduct';
import { NA } from '@constants/ElectronicInvoice';
import { Routes } from '@constants/Paths';
import { PRODUCT_TABLE_CONSTANTS } from '@constants/QuoteViewLabels';
import { KEYS_ASSIGN_DETAIL } from '@constants/TableInvoice';
import { IInvoiceDetailCalculate, IInvoiceDetails } from '@models/ElectronicInvoice';
import { IGenericRecord } from '@models/GenericRecord';
import { FieldName } from '@models/SalesInvoice';
import { RootState } from '@redux/rootReducer';
import { discardUntaxed, getTaxes, stringToFloat, validateTypeProduct } from '@utils/ElectronicInvoice';
import { multiOptionsSelect } from '@utils/ElectronicNote';
import { assignValue } from '@utils/Json';
import { lengthEqualToZero, lengthGreaterThanZero } from '@utils/Length';
import { discountOfValue, isEven, ivaDiscount } from '@utils/Number';
import { getRoute } from '@utils/Paths';
import { EMPTY_ARRAY_LENGTH } from '@utils/quoteHelpers';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import usePermissions from '@hooks/usePermissions';
import usePopper from '@hooks/usePopper';
import information from '@assets/images/info-green.svg';
import { IQuoteTableDataProps } from '..';
import {
    getTableCellClassName,
    getValidatedCellClassName,
    isValidTableConfiguration,
    QUOTE_PRODUCT_TABLE_HEADERS,
    QUOTE_QUERY_FIELDS,
    QuoteFieldLength,
} from '.';

export const QuoteProductsTable: React.FC<IQuoteTableDataProps> = ({ tableConfig, tableHandlers, tableOptions = {} }) => {
    if (!isValidTableConfiguration(tableConfig, tableHandlers)) {
        return <div className="p-4 text-red">Error: {PRODUCT_TABLE_CONSTANTS.ERROR_MESSAGES.INCOMPLETE_CONFIGURATION}</div>;
    }

    const { data = [], validate, errorMessages = [], perishableErrors = [] } = tableConfig;
    const { updateData, toggleTotalsQuery } = tableHandlers;
    const { isMandate = false, isPurchaseInvoice = false } = tableOptions;

    const { products, suppliers } = useSelector(({ electronicInvoice, suppliers }: RootState) => ({
        products: electronicInvoice.products || [],
        suppliers: suppliers.data || [],
    }));

    const { disabledInputs } = usePermissions();

    const addItem = useCallback((): void => {
        if (!updateData) {
            return;
        }
        try {
            const newProduct = { ...ADD_PRODUCT_SERVICE, id: uuid() };
            updateData([...data, newProduct]);
        } catch (error) {
            console.error('Error adding product:', error);
        }
    }, [data, updateData]);

    const deleteRow = useCallback((): void => {
        if (!updateData || !toggleTotalsQuery) {
            return;
        }
        const hasSelectedItems = data.some(item => item.checked);
        if (!hasSelectedItems) {
            return;
        }
        updateData(data.filter(item => !item.checked));
        toggleTotalsQuery();
    }, [data, updateData, toggleTotalsQuery]);

    const hasSelectedItems = useMemo(() => {
        return Array.isArray(data) && data.some(item => item.checked);
    }, [data]);

    const handleSelectionRow = useCallback(
        ({ target: { checked } }: ChangeEvent, row: number): void => {
            updateData(data.map((item, index) => ({ ...item, ...(index === row && { checked }) })));
        },
        [data, updateData]
    );

    const getCalculate = useCallback(
        ({ unit_cost = 0, quantity = 0, percentage_discount = 0 }: IInvoiceDetails): IInvoiceDetailCalculate => {
            const unitValue = stringToFloat(unit_cost) * stringToFloat(quantity);
            const discount = discountOfValue(unitValue, percentage_discount) || 0;
            return {
                unit_cost,
                unit_value: unitValue,
                discount,
                total_buy: unitValue - discount,
            };
        },
        []
    );

    const handleSelectProduct = useCallback(
        ({ option: { value, ...option } }: IGenericRecord, field: number): void => {
            const productFound = products.find(product => product.sku_internal === option.name || product.id === value) || {};
            const uniqueProductTaxes = discardUntaxed(productFound.unique_product_taxes) || [];
            const unit_value = productFound.is_include_tax
                ? ivaDiscount(productFound.unit_value, getTaxes(uniqueProductTaxes, IVA).tax_rate || 0)
                : productFound.unit_value || 0;

            updateData(
                data.map((item, index) =>
                    index === field
                        ? {
                              ...item,
                              ...validateTypeProduct(productFound),
                              ...assignValue(KEYS_ASSIGN_DETAIL, productFound),
                              sku_internal: productFound.sku_internal || option.name,
                              unique_products_id: productFound.unique_products_id || productFound.id || value,
                              id: productFound.id || value,
                              unique_product_name: productFound.unique_product_name || productFound.name || option.name,
                              description:
                                  productFound.description || productFound.unique_product_name || productFound.name || '',
                              reference: productFound.reference || productFound.sku_internal || '',
                              quantity: 0,
                              discount: 0,
                              percentage_discount: 0,
                              unit_value,
                              sale: unit_value,
                              unit_cost: unit_value,
                              total_buy: 0,
                              unit_measurements_id: productFound.unit_measurements_id || productFound.unit_measurement_id,
                              unit_measurement_name:
                                  productFound.unit_measurement_name || productFound.unit_measurement || 'Unidad',
                              product_taxes: uniqueProductTaxes,
                              taxes:
                                  uniqueProductTaxes?.map(({ company_tax_id, tax_value }) => ({ company_tax_id, tax_value })) ||
                                  [],
                          }
                        : item
                )
            );
            toggleTotalsQuery();
        },
        [data, products, updateData, toggleTotalsQuery]
    );

    const changeDynamicOption = useCallback(
        ({ option: { value, name: optionName, ...option }, name: field }: IGenericRecord, index: number): void => {
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
                            ...(FieldName.ExpirationDate === field && { [field]: optionName }),
                            ...(FieldName.Supplier === field && { mandate_id: value, mandate: option.mandate }),
                            ...(FieldName.Batch === field && {
                                batch_id: value,
                                batch_number: optionName,
                                batch_detail_id: batchDetailId,
                            }),
                            ...(FieldName.Warehouse === field &&
                                lengthEqualToZero(batches) && {
                                    batch_number: NA,
                                    date_expiration: NA,
                                }),
                            [`${field}_id`]: value,
                            [`${field}_name`]: optionName,
                        };
                    }
                    return item;
                })
            );
        },
        [data, products, updateData]
    );

    const handleDataChange = useCallback(
        ({ target: { name, value } }: IGenericRecord, field: number): void => {
            updateData(
                data.map((item, index) => {
                    const newItem = { ...item, ...(index === field && { [name]: value }) };
                    return {
                        ...newItem,
                        ...((name === FieldName.DiscountPercentage ||
                            name === FieldName.Quantity ||
                            name === FieldName.UnitCost) &&
                            getCalculate(newItem)),
                    };
                })
            );
            if (QUOTE_QUERY_FIELDS.includes(name)) toggleTotalsQuery();
        },
        [data, updateData, toggleTotalsQuery, getCalculate]
    );

    const selectSearchOptions = ({ value, id = '' }: IOptionSelect): IOption => ({ name: value, value: id });

    const optionsAssign = useCallback((options: IOption[], item: IInvoiceDetails, key: string): IOption[] => {
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
    }, []);

    const options = useMemo(() => {
        const baseOptions = buildOptionsTable({
            products: products || [],
            suppliers: suppliers || [],
            noteDetails: Array.isArray(data) ? data : [],
            invoiceDetails: [],
        });

        return baseOptions;
    }, [products, data, suppliers]);

    return (
        <div id="tableInvoice" className="quote-products-table">
            <Icon
                id={generateId({
                    module: ModuleApp.QUOTES,
                    submodule: `products-services`,
                    action: ActionElementType.TRASH,
                    elementType: ElementType.ICO,
                })}
                className={`w-5.5 h-5.5 mb-2 ml-auto transition-all duration-200 ${
                    hasSelectedItems ? 'opacity-100' : 'opacity-40 hover:opacity-60'
                }`}
                hoverIcon="trashGreen"
                name="trashBlue"
                onClick={deleteRow}
                style={{
                    cursor: hasSelectedItems ? 'pointer' : 'not-allowed',
                    filter: hasSelectedItems ? 'none' : 'grayscale(100%) brightness(1.5)',
                }}
                title={hasSelectedItems ? 'Eliminar productos seleccionados' : 'Selecciona productos para eliminar'}
            />
            <Table
                id={generateId({
                    module: ModuleApp.QUOTES,
                    submodule: `products-services`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.TBL,
                })}
                headerRowsCustom={<QuoteProductTableHeader isMandate={isMandate} isPurchaseInvoice={isPurchaseInvoice} />}
                className={`${errorMessages.length > EMPTY_ARRAY_LENGTH ? 'mb-2' : ''} quote-products-table__table`}
                tbodyClassName="quote-products-table__table"
                theadClassName="quote-products-table__table"
                idContentTable="mondaMonda"
                wrapperClassName="w-full"
                isHeaderRowsCustom
                customTable
                data={[]}
                isNew
            >
                {Array.isArray(data) &&
                    data.length > EMPTY_ARRAY_LENGTH &&
                    data
                        .filter(item => item && typeof item === 'object' && item.id)
                        .map((item, index) => (
                            <tr
                                id={generateId({
                                    module: ModuleApp.QUOTES,
                                    submodule: `products-services-${item.id}-${index}`,
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.ROW,
                                })}
                                key={item.id || index}
                            >
                                <td className="quote-products-table__border-none table-field">
                                    <SingleCheckBox
                                        checked={item.checked}
                                        handleChange={(e: ChangeEvent): void => handleSelectionRow(e, index)}
                                        name="checked"
                                        className="single-checkbox--table"
                                    />
                                </td>
                                <td className={getTableCellClassName(index)}>{index + 1}</td>
                                <td className={getValidatedCellClassName(index, validate, !item?.sku_internal)}>
                                    <SelectSearch
                                        id={generateId({
                                            module: ModuleApp.QUOTES,
                                            submodule: `products-services-${item.id}-${index}-sku`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.DRP,
                                        })}
                                        options={[
                                            ...(options.sku || []),
                                            ...(item.sku_internal
                                                ? [{ name: `${item.sku_internal} - ${item.unique_product_name}`, value: item.id }]
                                                : []),
                                        ]}
                                        value={item.id || ''}
                                        name="sku_internal"
                                        selectIconType="arrowDownGreen"
                                        className="quote-products-table__select"
                                        onChange={(option, name): void => handleSelectProduct({ option, name }, index)}
                                    />
                                </td>
                                <td className={getTableCellClassName(index)}>
                                    <TextArea
                                        id={generateId({
                                            module: ModuleApp.QUOTES,
                                            submodule: `products-services-${item.id}-${index}-description`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.TXT,
                                        })}
                                        value={item?.description || ''}
                                        name="description"
                                        onChange={(e): void => handleDataChange(e, index)}
                                        disabled={disabledInputs}
                                        placeholder="..."
                                        maxLength={QuoteFieldLength.Description}
                                    />
                                </td>
                                <td className={getValidatedCellClassName(index, validate, !item?.warehouse_id)}>
                                    {item.warehouse_name !== NA ? (
                                        <SelectSearch
                                            id={generateId({
                                                module: ModuleApp.QUOTES,
                                                submodule: `products-services-${item.id}-${index}-warehouse`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.DRP,
                                            })}
                                            onChange={(option, name): void => changeDynamicOption({ option, name }, index)}
                                            options={optionsAssign(
                                                options.warehouse?.[index]?.map(selectSearchOptions) || [],
                                                item,
                                                FieldName.Warehouse
                                            )}
                                            className="quote-products-table__select"
                                            value={item.warehouse_id || ''}
                                            selectIconType="arrowDownGreen"
                                            name="warehouse"
                                        />
                                    ) : (
                                        <p className="px-2 text-gray text-tiny lg:text-sm">{NA}</p>
                                    )}
                                </td>
                                <td className={getValidatedCellClassName(index, validate, !item?.batch_id)}>
                                    {item.batch_number !== NA ? (
                                        <SelectSearch
                                            id={generateId({
                                                module: ModuleApp.QUOTES,
                                                submodule: `products-services-${item.id}-${index}-batch`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.DRP,
                                            })}
                                            options={optionsAssign(
                                                options.batch?.[index]?.map(selectSearchOptions) || [],
                                                item,
                                                FieldName.Batch
                                            )}
                                            value={item.batch_id || ''}
                                            onChange={(option, name): void => {
                                                changeDynamicOption({ option, name }, index);
                                            }}
                                            selectIconType="arrowDownGreen"
                                            name="batch"
                                            className="quote-products-table__select"
                                        />
                                    ) : (
                                        <p className="px-2 text-gray text-tiny lg:text-sm">{NA}</p>
                                    )}
                                </td>
                                <td
                                    className={`table-field ${isEven(index + 1) ? 'bg-gray-light' : 'bg-white'} ${
                                        validate && !item?.date_expiration ? 'border-left-error' : ''
                                    }`}
                                >
                                    <span className="table-field-text">{item?.date_expiration || '...'}</span>
                                </td>
                                <td
                                    className={`table-field ${isEven(index + 1) ? 'bg-gray-light' : 'bg-white'} ${
                                        validate && !item?.quantity ? 'border-left-error' : ''
                                    }`}
                                >
                                    <NumberFormatInput
                                        id={generateId({
                                            module: ModuleApp.QUOTES,
                                            submodule: `products-services-${item.id}-${index}-quantity`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.TXT,
                                        })}
                                        {...defaultPropsInputNumber}
                                        name="quantity"
                                        value={item?.quantity || 0}
                                        placeholder="..."
                                        disabled={!item?.sku_internal}
                                        handleChange={(e): void => handleDataChange(e, index)}
                                    />
                                </td>
                                <td className={getTableCellClassName(index)}>
                                    <span className="table-field-text">{item?.unit_measurement_name || '...'}</span>
                                </td>
                                {isMandate && (
                                    <td
                                        className={`table-field ${isEven(index + 1) ? 'bg-gray-light' : 'bg-white'} ${
                                            validate && !item?.supplier_id ? 'border-left-error' : ''
                                        }`}
                                    >
                                        <SelectSearch
                                            id={generateId({
                                                module: ModuleApp.QUOTES,
                                                submodule: `products-services-${item.id}-${index}-supplier`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.DRP,
                                            })}
                                            value={item?.supplier_id}
                                            options={options.suppliers}
                                            placeholder="Select"
                                            onSelectOption={({ option: { value } }): void =>
                                                handleDataChange({ target: { name: FieldName.Supplier, value } }, index)
                                            }
                                            disabled={disabledInputs || !item?.sku_internal}
                                        />
                                    </td>
                                )}
                                <td
                                    className={`table-field ${isEven(index + 1) ? 'bg-gray-light' : 'bg-white'} ${
                                        validate && !item?.unit_cost ? 'border-left-error' : ''
                                    }`}
                                >
                                    <NumberFormatInput
                                        id={generateId({
                                            module: ModuleApp.QUOTES,
                                            submodule: `products-services-${item.id}-${index}-unit-cost`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.TXT,
                                        })}
                                        {...defaultPropsInputNumber}
                                        name="unit_cost"
                                        value={item?.unit_cost || 0}
                                        placeholder="..."
                                        disabled={!item?.sku_internal}
                                        handleChange={(e): void => handleDataChange(e, index)}
                                    />
                                </td>
                                <td className={getTableCellClassName(index)}>
                                    <PercentageFormatInput
                                        id={generateId({
                                            module: ModuleApp.QUOTES,
                                            submodule: `products-services-${item.id}-${index}-percentage`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.TXT,
                                        })}
                                        name="percentage_discount"
                                        value={item?.percentage_discount || 0}
                                        placeholder="..."
                                        disabled={!item?.sku_internal}
                                        handleChange={(e): void => handleDataChange(e, index)}
                                    />
                                </td>
                                <td className={getTableCellClassName(index)}>
                                    <span className="table-field-text">{item?.discount || 0}</span>
                                </td>
                                <td className={getTableCellClassName(index)}>
                                    <span className="table-field-text">
                                        {item && item.product_taxes && lengthGreaterThanZero(item.product_taxes)
                                            ? item.product_taxes
                                                  .map((tax: IGenericRecord) => tax.tax_name || '')
                                                  .filter(name => name)
                                                  .join(', ') || NA
                                            : NA}
                                    </span>
                                </td>
                            </tr>
                        ))}
            </Table>
            {validate && [...errorMessages, ...perishableErrors].map(error => <TableError key={error} customText={error} />)}
            <button
                id={generateId({
                    module: ModuleApp.QUOTES,
                    submodule: `products-services`,
                    action: ActionElementType.ADD,
                    elementType: ElementType.BTN,
                })}
                className={`mt-2 underline cursor-pointer ${disabledInputs ? 'text-gray' : 'text-green'} mb-4.5`}
                onClick={addItem}
                disabled={disabledInputs}
            >
                + Agregar producto/servicio a la cotización
            </button>
            <p className="text-blue my-4.5">
                Si no has agregado un producto/servicio a tu catálogo, &nbsp;
                <Link
                    id={generateId({
                        module: ModuleApp.QUOTES,
                        submodule: `products-services-catalog`,
                        action: ActionElementType.REDIRECT,
                        elementType: ElementType.LNK,
                    })}
                    classes="text-base"
                    href={`${getRoute(Routes.PRODUCT_DATABASE)}?${ADD_PRODUCT}=true`}
                    linkColor={LinkColor.PURPLE}
                    text="haz clic aquí."
                />
            </p>
        </div>
    );
};

const Information: React.FC<IGenericRecord> = ({ tooltip, title }) => {
    const { anchorEl, mouseProps } = usePopper();
    return (
        <div className="text-tiny lg:text-sm flex gap-0.5 items-center">
            <p {...mouseProps}>
                {tooltip && (
                    <>
                        <img alt="Information" className="quote-products-table__icon" src={information} />
                        <Tooltip anchorEl={anchorEl} placement="bottom" iconName="infoBlue" {...tooltip} />
                    </>
                )}
            </p>
            <span className="text-left leading-stiny">{title}</span>
        </div>
    );
};

const QuoteProductTableHeader: React.FC<{ isMandate: boolean; isPurchaseInvoice: boolean }> = React.memo(
    ({ isMandate, isPurchaseInvoice }) => {
        return (
            <tr>
                {QUOTE_PRODUCT_TABLE_HEADERS(isMandate, isPurchaseInvoice).map(({ className, title, tooltip }) => (
                    <th
                        key={className}
                        className={`table-head quote-products-table__${className} ${
                            className === 'selector' ? 'quote-products-table__border-none' : 'bg-green-extraLight'
                        }`}
                    >
                        <Information title={title} tooltip={tooltip} />
                    </th>
                ))}
            </tr>
        );
    }
);
