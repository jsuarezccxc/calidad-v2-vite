import React, { useCallback, useRef } from 'react';

import { TableTaxRetention } from '@components/table-tax-retention';

import { ONE_HUNDRED, ONE_THOUSAND } from '@constants/ElectronicInvoice';
import { RETE_ICA, RETE_IVA } from '@constants/Tax';

import usePermissions from '@hooks/usePermissions';

import { ITableTaxesAndRetention } from '@models/ElectronicInvoice';
import { NumberFormatValues } from 'react-number-format';

import { QUOTE_DEFAULT_VALUES, QUOTE_VAT_VALUES, shouldApplyPercentage } from '.';

/**
 * Props interface for QuoteWithholdingTable component
 * Manages tax withholding (retenciones) data for quotes
 *
 * @interface IQuoteWithholdingTableProps
 * @typeParam withholdingData: ITableTaxesAndRetention[] - Array of withholding tax records (Retefuente, ReteICA, ReteIVA)
 * @typeParam updateWithholdingData: (data: ITableTaxesAndRetention[]) => void - Callback to update withholding data array
 * @typeParam toggleTotalsQuery: () => void - Function to trigger totals recalculation after withholding changes
 */
export interface IQuoteWithholdingTableProps {
    withholdingData: ITableTaxesAndRetention[];
    updateWithholdingData: (data: ITableTaxesAndRetention[]) => void;
    toggleTotalsQuery: () => void;
}

export const QuoteWithholdingTable: React.FC<IQuoteWithholdingTableProps> = ({
    withholdingData,
    updateWithholdingData,
    toggleTotalsQuery,
}) => {
    const { disabledInputs } = usePermissions();
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
        getTotals();
    };

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
        />
    );
};
