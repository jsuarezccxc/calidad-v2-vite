import React from 'react';
import { v4 as uuid } from 'uuid';

import information from '@assets/images/info-green.svg';

import { LinkAdd } from '@components/button';
import { SingleCheckBox } from '@components/checkbox';
import { Icon } from '@components/icon';
import { ChangeEvent } from '@components/input';
import { Table } from '@components/table';
import { TableError } from '@components/table-error';
import { NumberFormatInput, PercentageFormatInput, Text } from '@components/table-input';
import { Tooltip } from '@components/tooltip';

import usePopper from '@hooks/usePopper';
import usePermissions from '@hooks/usePermissions';

import { MILLILITER } from '@constants/Product';

import { IGenericRecord } from '@models/GenericRecord';
import { eTaxes } from '@models/Taxes';

import { removeThousandsPoint } from '@utils/Decimals';
import { stringToFloat } from '@utils/ElectronicInvoice';

import {
    IProductTableProps,
    getDiscount,
    PRODUCT_ITEM,
    PRODUCT_TABLE_HEADERS,
    MaxiLengthTable,
    TableNameInputs,
    HUNDRED,
    THOUSAND,
    TEN,
    ZERO,
} from '.';

export const ProductsTable: React.FC<IProductTableProps> = ({
    data,
    errorMessages,
    updateData,
    validate,
    handleGoToAddTaxes,
}) => {
    const { disabledInputs } = usePermissions();

    const addItem = (): void => updateData([...data, { ...PRODUCT_ITEM, unique_products_id: uuid() }]);

    const deleteRow = (): void => updateData(data.filter(item => !item.checked));

    const reCalculateTaxes = (taxes: IGenericRecord, unitCost: number, quantity: number): IGenericRecord[] => {
        const taxCalculations = {
            [eTaxes.IVA]: (tax: IGenericRecord): number => (parseFloat(tax.tax_rate) / HUNDRED) * unitCost ?? ZERO,
            [eTaxes.ICUI]: (tax: IGenericRecord): number => tax.tax_rate * unitCost ?? ZERO,
            [eTaxes.INC]: (tax: IGenericRecord): number => tax.tax_rate * unitCost ?? ZERO,
            [eTaxes.IBUA]: (tax: IGenericRecord): number =>
                (tax.unit_measure_content === MILLILITER
                    ? (tax.unit_measure_milliliters / HUNDRED) * tax.tax_rate
                    : (tax.unit_measure_milliliters / THOUSAND) * TEN * tax.tax_rate) * stringToFloat(quantity) ?? ZERO,
        };

        return taxes.map((tax: IGenericRecord) => ({
            ...tax,
            ...(tax.tax_name in taxCalculations && { tax_value: taxCalculations[tax.tax_name as eTaxes](tax) }),
        }));
    };

    const handleDataChange = ({ target: { name, value } }: IGenericRecord, row: number): void => {
        updateData(
            data.map((item, index) => {
                let taxes = [];
                const defaultUnitCost = stringToFloat(item.unit_cost) ?? ZERO;
                const defaultQuantity = stringToFloat(item.quantity) ?? ZERO;
                const percentage = stringToFloat(String(value).replace('%', ''));
                const mappings = {
                    [TableNameInputs.UNIT_COST]: {
                        unit_cost: stringToFloat(value) ?? ZERO,
                        quantity: defaultQuantity,
                        discount: getDiscount({
                            ...item,
                            unit_cost: stringToFloat(value) ?? ZERO,
                            quantity: defaultQuantity,
                        }),
                    },
                    [TableNameInputs.QUANTITY]: {
                        unit_cost: defaultUnitCost,
                        quantity: stringToFloat(value) ?? ZERO,
                        discount: getDiscount({
                            ...item,
                            unit_cost: defaultUnitCost,
                            quantity: stringToFloat(value) ?? ZERO,
                        }),
                    },
                    [TableNameInputs.PERCENTAGE_DISCOUNT]: {
                        unit_cost: defaultUnitCost,
                        quantity: defaultQuantity,
                        discount: getDiscount({
                            ...item,
                            discount_percentage: percentage > HUNDRED ? item.discount_percentage : value,
                        }),
                    },
                };
                const { unit_cost, quantity, discount } = mappings[name as TableNameInputs] || {
                    unit_cost: defaultUnitCost,
                    quantity: defaultQuantity,
                    discount: getDiscount({ ...item, unit_cost: defaultUnitCost, quantity: defaultQuantity }),
                };

                if (index === row && item?.unique_product_taxes.length) {
                    taxes = item.unique_product_taxes;
                    if (
                        name === TableNameInputs.QUANTITY ||
                        name === TableNameInputs.UNIT_COST ||
                        name === TableNameInputs.PERCENTAGE_DISCOUNT
                    ) {
                        taxes = reCalculateTaxes(
                            item.unique_product_taxes,
                            unit_cost * stringToFloat(quantity) - discount,
                            stringToFloat(quantity)
                        );
                    }
                }
                return {
                    ...item,
                    ...(index === row && {
                        [name]:
                            name === TableNameInputs.PERCENTAGE_DISCOUNT && percentage > HUNDRED
                                ? item.discount_percentage
                                : value,
                        unique_product_taxes: taxes,
                    }),
                };
            })
        );
    };

    const handleSelectionRow = ({ target: { checked } }: ChangeEvent, row: number): void => {
        updateData(data.map((item, index) => ({ ...item, ...(index === row && { checked }) })));
    };

    return (
        <div className="products-table">
            <Icon className="mb-2 ml-auto" hoverIcon="trashGreen" name="trashBlue" onClick={deleteRow} />
            <Table
                className={`${errorMessages.length ? 'mb-2' : ''} products-table__table`}
                customTable
                data={[]}
                headerRowsCustom={<ProductTableHeader />}
                isHeaderRowsCustom
                withScrollTable
            >
                {data.map((item, index) => (
                    <tr key={`${item.name}-${index}`}>
                        <td className="table-field products-table__selector">
                            <SingleCheckBox
                                checked={item?.checked}
                                handleChange={(e: ChangeEvent): void => handleSelectionRow(e, index)}
                                name="checked"
                                classInput={!item?.checked ? 'fix-bg' : ''}
                            />
                        </td>
                        <td className="table-field products-table__number">{index + 1}</td>
                        <td
                            className={`table-field products-table__sku ${validate && !item?.sku ? 'table-field--required' : ''}`}
                        >
                            <Text
                                type="text"
                                onChange={(e): void => handleDataChange(e, index)}
                                editTable
                                name="sku"
                                className="products-table__sku"
                                placeholder="..."
                                text={item?.sku}
                                maxLength={MaxiLengthTable.Large}
                                disabled={disabledInputs}
                            />
                        </td>
                        <td
                            className={`table-field products-table__quantity ${
                                validate && !item?.quantity ? 'table-field--required' : ''
                            }`}
                        >
                            <NumberFormatInput
                                value={item?.quantity}
                                handleChange={(e): void => handleDataChange(e, index)}
                                name="quantity"
                                withIcon={false}
                                placeholder="..."
                                allowNegative={false}
                                disabled={disabledInputs}
                            />
                        </td>
                        <td className="table-field products-table__unit-cost">
                            <NumberFormatInput
                                value={item?.unit_cost}
                                handleChange={(e): void => handleDataChange(e, index)}
                                name="unit_cost"
                                allowNegative={false}
                                maxLength={MaxiLengthTable.Medium}
                                disabled={disabledInputs}
                            />
                        </td>
                        <td className="table-field products-table__discount">
                            <PercentageFormatInput
                                placeholder="..."
                                name="discount_percentage"
                                decimals={ZERO}
                                value={item.discount_percentage}
                                handleChange={(e): void => handleDataChange(e, index)}
                                disabled={disabledInputs}
                            />
                        </td>
                        <td className="table-field products-table__discount">
                            <NumberFormatInput
                                inputClass="text-gray"
                                placeholder="000.000.000"
                                value={getDiscount(item)}
                                decimals={ZERO}
                                disabled
                                maxLength={MaxiLengthTable.Medium}
                            />
                        </td>
                        <td className="table-field products-table__taxes">
                            <div className="flex flex-col">
                                {item?.unique_product_taxes?.length ? (
                                    item.unique_product_taxes.map(({ tax_name: name, tax_value: value }: IGenericRecord) => (
                                        <p className="text-gray-dark text-tiny lg:text-sm" key={name}>
                                            {name} - ${parseFloat(value).toFixed(3)}
                                        </p>
                                    ))
                                ) : (
                                    <LinkAdd
                                        disabled={!parseInt(removeThousandsPoint(item?.unit_cost)) || disabledInputs}
                                        onClick={(): void => handleGoToAddTaxes(item)}
                                        classes="text-tiny lg:text-sm"
                                        text="+ Agregar impuesto"
                                    />
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
            </Table>
            {validate && errorMessages.map(error => <TableError key={error} customText={error} />)}
            <button
                className={`mt-2 underline cursor-pointer ${disabledInputs ? 'text-gray' : 'text-green'} mb-4.5`}
                onClick={addItem}
                disabled={disabledInputs}
            >
                + Agregar producto/servicio
            </button>
        </div>
    );
};

const ProductTableHeader: React.FC = () => {
    const { activePopper, anchorEl, mouseProps } = usePopper();

    const tableHeaders = PRODUCT_TABLE_HEADERS();

    const tooltip = tableHeaders.find(item => item.title === activePopper)?.tooltip;

    return (
        <tr className="bg-green-extraLight">
            {tableHeaders.map(({ className, title, tooltip }) => (
                <th key={className} className={`table-head products-table__${className}`}>
                    <p className="text-tiny lg:text-sm flex gap-0.5 items-center">
                        {tooltip && (
                            <img
                                id={title}
                                alt="Information"
                                className="w-5.5 h-5.5 cursor-pointer"
                                src={information}
                                {...mouseProps}
                            />
                        )}
                        <span className="text-left text-blue">{title}</span>
                    </p>
                </th>
            ))}
            <Tooltip anchorEl={anchorEl} placement="bottom-start" iconName="infoBlue" {...tooltip} />
        </tr>
    );
};
