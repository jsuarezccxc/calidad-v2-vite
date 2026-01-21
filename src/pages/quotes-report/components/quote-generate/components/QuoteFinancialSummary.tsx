import React, { useCallback, useEffect, useRef, useState } from 'react';

import { NumberFormatInput } from '@components/table-input';
import { TableTaxRetention } from '@components/table-tax-retention';

import { DATA_TABLE_TOTALS, ONE_HUNDRED, ONE_THOUSAND } from '@constants/ElectronicInvoice';
import { RETE_ICA, RETE_IVA } from '@constants/Tax';

import usePermissions from '@hooks/usePermissions';

import { ITableTaxesAndRetention } from '@models/ElectronicInvoice';
import { NumberFormatValues } from 'react-number-format';

import { updateTableTotals } from '@utils/ElectronicInvoice';

import './QuoteFinancialSummary.scss';

import { QUOTE_DEFAULT_VALUES, QUOTE_TOTAL_FIELDS, QUOTE_VAT_VALUES, shouldApplyPercentage, formatQuoteNumber } from '.';
import { IQuoteFinancialSummaryProps, ISendingChargeChangeEvent, ITotalTableRow } from '..';

const QuoteSubTotals: React.FC<{
    totalsTable: ITotalTableRow[];
    sendingCharge: number;
    handleSendingChargeChange: (e: ISendingChargeChangeEvent) => void;
    disableShippingCost: boolean;
    disabledInputs: boolean;
}> = ({ totalsTable, sendingCharge, handleSendingChargeChange, disableShippingCost, disabledInputs }) => {
    return (
        <article className="table-total">
            {totalsTable?.map(({ id, title, disabled, field, value }) => {
                const isBold = QUOTE_TOTAL_FIELDS?.find(totalElement => totalElement.key === field)?.bold;
                const className = isBold ? 'font-allerbold' : '';

                return (
                    <section className="table-total__container" key={id || `total-${field}`}>
                        <p className={`table-total__label ${className}`}>{title}</p>
                        {!disabled ? (
                            <NumberFormatInput
                                containerClass={`billing-information__shipping-cost${disabledInputs ? '--disabled' : ''}`}
                                value={sendingCharge}
                                onChange={handleSendingChargeChange}
                                disabled={disableShippingCost || disabledInputs}
                                fixedDecimalScale
                                withIcon={false}
                                prefix="$"
                                id={id}
                            />
                        ) : (
                            <h3 className={`table-total__value ${className}`}>${formatQuoteNumber(value)}</h3>
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
    const [totalsTable, setTotalsTable] = useState<ITotalTableRow[]>(() => DATA_TABLE_TOTALS({ isInvoice: true }));

    useEffect(() => {
        const updatedTotals = updateTableTotals(totals, true);
        setTotalsTable(updatedTotals);
    }, [totals]);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const getTotals = useCallback((): void => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            toggleTotalsQuery();
            timeoutRef.current = null;
        }, QUOTE_DEFAULT_VALUES.TIMEOUT_DELAY);
    }, [toggleTotalsQuery]);

    const handleSendingChargeChange = useCallback(
        (e: ISendingChargeChangeEvent) => {
            updateSendingCharge(e);
            getTotals();
        },
        [updateSendingCharge, getTotals]
    );

    const handleWithholdingChange = (
        { floatValue = NaN }: NumberFormatValues,
        nameField: string,
        item: ITableTaxesAndRetention
    ): void => {
        updateWithholdingData(
            withholdingData.map(withholding => {
                if (withholding.name === item.name && nameField === 'percentage') {
                    let percentage = floatValue;
                    const isReteICA = withholding.name.includes(RETE_ICA);

                    if (shouldApplyPercentage(floatValue, withholding.name)) {
                        percentage = floatValue;
                    }
                    if (RETE_IVA === withholding.name) {
                        percentage = floatValue;
                    }

                    return {
                        ...withholding,
                        percentage,
                        value: (withholding.base * Number(percentage)) / (isReteICA ? ONE_THOUSAND : ONE_HUNDRED),
                    };
                }
                return withholding;
            })
        );
        toggleTotalsQuery();
    };

    if (isOnlyWithholdingTable) {
        return (
            <TableTaxRetention
                dataValuesTableRetention={withholdingData}
                onChangeTableRetention={handleWithholdingChange}
                errorsTableRetention={{
                    messageFuente: '',
                    messageIca: '',
                    messageIva: '',
                    reteFuente: false,
                    reteIca: false,
                    reteIva: false,
                }}
                options={{ reteIVA: QUOTE_VAT_VALUES }}
                isDisabledWithholdings={disabledInputs}
                symbol="$"
                showTaxes={false}
                thousandSeparator=","
                decimalSeparator="."
                placeholder="000,000,000"
            />
        );
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
            <TableTaxRetention
                dataValuesTableRetention={withholdingData}
                onChangeTableRetention={handleWithholdingChange}
                errorsTableRetention={{
                    messageFuente: '',
                    messageIca: '',
                    messageIva: '',
                    reteFuente: false,
                    reteIca: false,
                    reteIva: false,
                }}
                options={{ reteIVA: QUOTE_VAT_VALUES }}
                isDisabledWithholdings={disabledInputs}
                symbol="$"
                showTaxes={false}
                thousandSeparator=","
                decimalSeparator="."
                placeholder="000,000,000"
            />
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
