import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SelectSearch } from '@components/select-search';
import { Table } from '@components/table';
import { NumberFormatInput, PercentageFormatInput } from '@components/table-input';
import { DATA_TABLE_TOTALS, ONE_HUNDRED, ONE_THOUSAND, OPTIONS_NUMBER_FORMAT, TWO } from '@constants/ElectronicInvoice';
import { RETE_ICA, RETE_IVA } from '@constants/Tax';
import { IGenericRecord } from '@models/GenericRecord';
import { formatMoney } from '@utils/Decimals';
import { formatNumber } from '@utils/Number';
import { eventToNumber, updateTableTotals } from '@utils/ElectronicInvoice';
import { isEven } from '@utils/Number';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import usePermissions from '@hooks/usePermissions';
import { QUOTE_TOTAL_FIELDS, QUOTE_VAT_VALUES, QUOTE_WITHHOLDING_TABLE_HEADINGS, shouldApplyPercentage } from '.';
import { IQuoteFinancialSummaryProps, ISendingChargeChangeEvent, ITotalTableRow } from '..';

const DEFAULT_PERCENTAGE_VALUE = '0';

const QuoteSubTotals: React.FC<{
    totalsTable: ITotalTableRow[];
    sendingCharge: number;
    handleSendingChargeChange: (e: ISendingChargeChangeEvent) => void;
    disableShippingCost: boolean;
    disabledInputs: boolean;
}> = ({ totalsTable, sendingCharge, handleSendingChargeChange, disableShippingCost, disabledInputs }) => {
    return (
        <article className="table-total">
            {totalsTable?.map(({ title, disabled, field, value }, index) => {
                const isBold = QUOTE_TOTAL_FIELDS?.find(totalElement => totalElement.key === field)?.bold;
                const className = isBold ? 'font-allerbold' : '';

                return (
                    <section className="table-total__container" key={`total-${field}`}>
                        <p className={`table-total__label ${className}`}>{title}</p>
                        {!disabled ? (
                            <NumberFormatInput
                                id={generateId({
                                    module: ModuleApp.QUOTES,
                                    submodule: `financial-summary-subtotals-${index}`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.DRP,
                                })}
                                containerClass={`billing-information__shipping-cost${disabledInputs ? '--disabled' : ''}`}
                                value={sendingCharge}
                                onChange={handleSendingChargeChange}
                                disabled={disableShippingCost || disabledInputs}
                                fixedDecimalScale
                                withIcon={false}
                                prefix="$"
                            />
                        ) : (
                            <h3 className={`table-total__value ${className}`}>${formatNumber(value, OPTIONS_NUMBER_FORMAT)}</h3>
                        )}
                    </section>
                );
            })}
        </article>
    );
};

export const QuoteFinancialSummary: React.FC<IQuoteFinancialSummaryProps> = ({
    withholdingData,
    updateWithholdingData,
    totals,
    sendingCharge,
    updateSendingCharge,
    disableShippingCost,
    toggleTotalsQuery,
    isOnlyWithholdingTable = false,
    isOnlySubTotals = false,
}) => {
    const { disabledInputs } = usePermissions();
    const [totalsTable, setTotalsTable] = useState([...DATA_TABLE_TOTALS({ isInvoice: true })]);

    useEffect(() => {
        setTotalsTable([...updateTableTotals(totals, true)]);
    }, [totals]);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const getTotals = useCallback((): void => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            toggleTotalsQuery();
            timeoutRef.current = null;
        }, 1000);
    }, [toggleTotalsQuery]);

    const handleSendingChargeChange = useCallback(
        (e: ISendingChargeChangeEvent) => {
            updateSendingCharge(e);
            getTotals();
        },
        [updateSendingCharge, getTotals]
    );

    const handleDataChange = ({ floatValue }: IGenericRecord, row: number): void => {
        updateWithholdingData(
            withholdingData.map(({ name, ...item }, index) => {
                if (index === row) {
                    let percentage = item.percentage;
                    const isReteICA = name.includes(RETE_ICA);
                    if (shouldApplyPercentage(floatValue, name)) {
                        percentage = floatValue;
                    }
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

    const TableHeader: React.FC = () => (
        <tr className="bg-green-extraLight">
            {QUOTE_WITHHOLDING_TABLE_HEADINGS.map(item => (
                <th key={item} className="text-center table-head withholding-table__size-header">
                    {item}
                </th>
            ))}
        </tr>
    );

    const WithholdingTable: React.FC = () => (
        <Table
            id={generateId({
                module: ModuleApp.QUOTES,
                submodule: `financial-summary`,
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
            {withholdingData.map(({ base, isSelectInput, percentage, name, value }, index) => (
                <tr
                    id={generateId({
                        module: ModuleApp.QUOTES,
                        submodule: `financial-summary-${index}`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.ROW,
                    })}
                    className={isEven(index + 1) ? 'bg-gray-light' : 'bg-white'}
                    key={name}
                >
                    <td className="text-center table-field table-field--disabled">{name}</td>
                    <td className="text-center table-field table-field--disabled">{formatMoney(base)}</td>
                    <td className="text-center table-field">
                        {isSelectInput ? (
                            <SelectSearch
                                id={generateId({
                                    module: ModuleApp.QUOTES,
                                    submodule: `financial-summary-${index}-values`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.DRP,
                                })}
                                onChange={(option): void => handleDataChange(eventToNumber(option.value), index)}
                                inputClass="withholding-table__select withholding-table__text-center text-tiny"
                                selectIconType="arrowDownGreen"
                                disabled={disabledInputs}
                                options={QUOTE_VAT_VALUES}
                                value={String(percentage ?? DEFAULT_PERCENTAGE_VALUE)}
                            />
                        ) : (
                            <PercentageFormatInput
                                id={generateId({
                                    module: ModuleApp.QUOTES,
                                    submodule: `financial-summary-${index}-percentages`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                value={percentage}
                                fixedDecimalScale
                                name="percentage"
                                inputClass="withholding-table__text-center"
                                handleChange={({ target }): void =>
                                    handleDataChange(eventToNumber(String(target.value).replace('%', '')), index)
                                }
                                disabled={disabledInputs}
                                decimals={TWO}
                            />
                        )}
                    </td>
                    <td className="text-center table-field table-field--disabled">{formatMoney(value)}</td>
                </tr>
            ))}
        </Table>
    );

    if (isOnlyWithholdingTable) {
        return <WithholdingTable />;
    }

    if (isOnlySubTotals) {
        return (
            <QuoteSubTotals
                totalsTable={totalsTable}
                sendingCharge={sendingCharge}
                handleSendingChargeChange={handleSendingChargeChange}
                disableShippingCost={disableShippingCost}
                disabledInputs={disabledInputs}
            />
        );
    }

    return (
        <div className="flex flex-col gap-4 w-max lg:flex-row">
            <WithholdingTable />
            <QuoteSubTotals
                totalsTable={totalsTable}
                sendingCharge={sendingCharge}
                handleSendingChargeChange={handleSendingChargeChange}
                disableShippingCost={disableShippingCost}
                disabledInputs={disabledInputs}
            />
        </div>
    );
};
