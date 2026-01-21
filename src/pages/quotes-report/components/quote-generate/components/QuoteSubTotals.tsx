import React, { useCallback, useEffect, useRef, useState } from 'react';

import { NumberFormatInput } from '@components/table-input';

import { DATA_TABLE_TOTALS } from '@constants/ElectronicInvoice';
import { IInvoiceCalculates } from '@models/ElectronicInvoice';

import usePermissions from '@hooks/usePermissions';

import { updateTableTotals } from '@utils/ElectronicInvoice';

import { formatQuoteNumber, QUOTE_DEFAULT_VALUES, QUOTE_TOTAL_FIELDS } from '.';

/**
 * Event structure for sending charge changes
 *
 * @interface ISendingChargeChangeEvent
 * @typeParam value: number - Numeric value of the sending charge
 */
export interface ISendingChargeChangeEvent {
    value: number;
}

/**
 * Props interface for QuoteSubTotals component
 * Manages quote financial summary display and sending charge updates
 *
 * @interface IQuoteSubTotalsProps
 * @typeParam totals: IInvoiceCalculates - Calculated totals for the quote (subtotal, taxes, total)
 * @typeParam sendingCharge: number - Current sending/shipping charge amount
 * @typeParam updateSendingCharge: (e: ISendingChargeChangeEvent) => void - Callback to update sending charge value
 * @typeParam disableShippingCost: boolean - Flag to disable/enable shipping cost input field
 * @typeParam toggleTotalsQuery: () => void - Function to trigger totals recalculation
 */
export interface IQuoteSubTotalsProps {
    totals: IInvoiceCalculates;
    sendingCharge: number;
    updateSendingCharge: (e: ISendingChargeChangeEvent) => void;
    disableShippingCost: boolean;
    toggleTotalsQuery: () => void;
}

export const QuoteSubTotals: React.FC<IQuoteSubTotalsProps> = ({
    totals,
    sendingCharge,
    updateSendingCharge,
    disableShippingCost,
    toggleTotalsQuery,
}) => {
    const { disabledInputs } = usePermissions();
    const [totalsTable, setTotalsTable] = useState([...DATA_TABLE_TOTALS({ isInvoice: true })]);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setTotalsTable([...updateTableTotals(totals, true)]);
    }, [totals]);

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
                                thousandSeparator=","
                                decimalSeparator="."
                                placeholder="000,000,000"
                            />
                        ) : (
                            <h3 className={`table-total__value ${className}`}>
                                {value === 0 ? '$000,000,000' : `$${formatQuoteNumber(value)}`}
                            </h3>
                        )}
                    </section>
                );
            })}
        </article>
    );
};
