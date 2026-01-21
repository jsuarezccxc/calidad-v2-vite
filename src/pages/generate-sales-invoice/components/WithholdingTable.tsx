import React from 'react';
import { SelectSearch } from '@components/select-search';
import { Table } from '@components/table';
import { NumberFormatInput, PercentageFormatInput } from '@components/table-input';
import { IGenericRecord } from '@models/GenericRecord';
import { isEven } from '@utils/Number';
import { eventToNumber } from '@utils/ElectronicInvoice';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import usePermissions from '@hooks/usePermissions';
import { RETE_ICA, RETE_IVA } from '@constants/Tax';
import { ONE_HUNDRED, ONE_THOUSAND, TEN, THREE, TWO } from '@constants/ElectronicInvoice';
import { IWithholdingsProps, VAT_VALUES, WITHHOLDING_TABLE_HEADINGS } from '.';

export const WithholdingTable: React.FC<IWithholdingsProps> = ({ data, toggleTotalsQuery, updateData, symbol }) => {
    const { disabledInputs } = usePermissions();

    const handleDataChange = ({ floatValue }: IGenericRecord, row: number): void => {
        updateData(
            data.map(({ name, ...item }, index) => {
                if (index === row) {
                    let percentage = item.percentage;
                    const isReteICA = name.includes(RETE_ICA);
                    if ((floatValue < TEN && isReteICA) || (floatValue < ONE_HUNDRED && ![RETE_ICA, RETE_IVA].includes(name)))
                        percentage = floatValue;

                    if (percentage < TEN && isReteICA && !Number.isFinite(Number(floatValue))) percentage = 0;

                    if (RETE_IVA === name) percentage = floatValue;
                    return {
                        ...item,
                        percentage,
                        value: (item.base * Number(percentage)) / (isReteICA ? ONE_THOUSAND : ONE_HUNDRED),
                        name,
                    };
                }
                return { ...item, name };
            })
        );
        toggleTotalsQuery();
    };

    return (
        <Table
            id={generateId({
                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-product-withholdings`,
                action: ActionElementType.INFO,
                elementType: ElementType.TBL,
            })}
            className="withholding-table"
            customTable
            data={[]}
            headerRowsCustom={<TableHeader />}
            isHeaderRowsCustom
            withScrollTable
        >
            {data.map(({ base, isSelectInput, percentage, name, value }, index) => (
                <tr
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `${ModuleApp.ELECTRONIC_INVOICE}-product-withholdings-${index}`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.ROW,
                    })}
                    className={`${isEven(index + 1) ? 'bg-gray-light' : 'bg-white'}`}
                    key={name}
                >
                    <td className="table-field table-field--disabled">{name}</td>
                    <td className="table-field table-field--disabled">
                        <NumberFormatInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-product-withholdings-${index}-base`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.ROW,
                            })}
                            inputClass="number-input number-input--disabled mx-2"
                            containerClass="number-input--m-left-0"
                            fixedDecimalScale
                            withIcon={false}
                            prefix={symbol}
                            value={base}
                            disabled
                        />
                    </td>
                    <td className="table-field">
                        {isSelectInput ? (
                            <SelectSearch
                                onChange={(option): void => handleDataChange(eventToNumber(option.value), index)}
                                inputClass="withholding-table__select text-tiny"
                                selectIconType="arrowDownGreen"
                                disabled={disabledInputs}
                                options={VAT_VALUES}
                                value={String(percentage)}
                            />
                        ) : (
                            <PercentageFormatInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `${ModuleApp.ELECTRONIC_INVOICE}-product-withholdings-${index}-percentage`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.ROW,
                                })}
                                value={percentage}
                                fixedDecimalScale
                                name="percentage"
                                inputClass="withholding-table__text-left"
                                handleChange={({ target }): void =>
                                    handleDataChange(eventToNumber(String(target.value).replace('%', '')), index)
                                }
                                disabled={disabledInputs}
                                decimals={name === RETE_ICA ? THREE : TWO}
                            />
                        )}
                    </td>
                    <td className="table-field table-field--disabled">
                        <NumberFormatInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-product-withholdings-${index}-value`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.ROW,
                            })}
                            inputClass="number-input number-input--disabled mx-2"
                            containerClass="number-input--m-left-0"
                            fixedDecimalScale
                            withIcon={false}
                            prefix={symbol}
                            value={value}
                            disabled
                        />
                    </td>
                </tr>
            ))}
        </Table>
    );
};

export const TableHeader: React.FC = () => (
    <tr className="bg-green-extraLight">
        {WITHHOLDING_TABLE_HEADINGS.map(item => (
            <th key={item} className="text-left table-head withholding-table__size-header">
                {item}
            </th>
        ))}
    </tr>
);
