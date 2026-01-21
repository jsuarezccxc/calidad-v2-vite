/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { NumberFormatInput } from '@components/table-input';
import { updateTableTotals } from '@utils/ElectronicInvoice';
import { formatNumber } from '@utils/Number';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import usePermissions from '@hooks/usePermissions';
import { DATA_TABLE_TOTALS, OPTIONS_NUMBER_FORMAT } from '@constants/ElectronicInvoice';
import { ISubTotalsProps, TOTAL_FIELDS } from '.';

export const SubTotals: React.FC<ISubTotalsProps> = ({
    disableShippingCost,
    sendingCharge,
    totals,
    symbol,
    toggleTotalsQuery,
    updateSendingCharge,
}) => {
    const [totalsTable, setTotalsTable] = useState([...DATA_TABLE_TOTALS({ isInvoice: true })]);

    const { disabledInputs } = usePermissions();

    let timeout: any;

    const getTotals = (): void => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            toggleTotalsQuery();
            clearTimeout(timeout);
        }, 1000);
    };

    useEffect(() => {
        setTotalsTable([...updateTableTotals(totals, true)]);
    }, [totals]);

    return (
        <article className="table-total">
            {totalsTable?.map(({ value, ...item }, index) => {
                const className = TOTAL_FIELDS?.find(totalElement => totalElement.key === item.field)?.bold
                    ? 'font-allerbold'
                    : '';

                return (
                    <section
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `${ModuleApp.ELECTRONIC_INVOICE}-subtotals-${index}-detail`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.TBL,
                        })}
                        className="table-total__container"
                        key={`${index}-detail`}
                    >
                        <p className={className} style={{ width: '9.8125rem' }}>
                            {item.title}
                        </p>
                        {!item.disabled ? (
                            <NumberFormatInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `${ModuleApp.ELECTRONIC_INVOICE}-subtotals-${index}-detail`,
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.TXT,
                                })}
                                containerClass={`billing-information__shipping-cost${disabledInputs ? '--disabled' : ''}`}
                                disabled={disableShippingCost || disabledInputs}
                                onChange={updateSendingCharge}
                                value={sendingCharge}
                                onKeyUp={getTotals}
                                fixedDecimalScale
                                withIcon={false}
                                prefix={symbol}
                            />
                        ) : (
                            <h3 className={className}>
                                {symbol}
                                {formatNumber(value, OPTIONS_NUMBER_FORMAT)}
                            </h3>
                        )}
                    </section>
                );
            })}
        </article>
    );
};
