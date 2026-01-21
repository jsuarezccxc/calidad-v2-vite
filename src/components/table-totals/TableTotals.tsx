import React, { Fragment, useMemo } from 'react';
import { ONE } from '@constants/ElectronicInvoice';
import { OPTIONS_NUMBER_FORMAT } from '@constants/ElectronicInvoice';
import { Form } from '@components/form';
import { ChangeEvent, MoneyInput } from '@components/input';
import { KeysInvoiceCalculates } from '@models/ElectronicInvoice';
import usePermissions from '@hooks/usePermissions';
import { defaultPercentageInput, eventToNumber } from '@utils/ElectronicInvoice';
import { formatNumber } from '@utils/Number';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { ITableTotalsProps } from '.';
import './TableTotals.scss';

export const TableTotals: React.FC<ITableTotalsProps> = ({
    symbol,
    isDisabledTotals = false,
    totalValues,
    dataTotals,
    onChange,
    isSupportOrAdjustment = false,
}) => {
    const { disabledInputs } = usePermissions();

    const tableTotals = useMemo(() => dataTotals.filter(item => (isSupportOrAdjustment ? !item?.omitElement : true)), [
        dataTotals,
    ]);

    return (
        <div className="table-totals">
            {tableTotals.map(({ disabled, value, title, className, field, symbol: symbolTotal }, index) => (
                <Fragment key={index}>
                    <div className={`${className} body__title height-19px w-38.4`}>
                        <h3>{title}</h3>
                    </div>
                    <div className={`${className} body__title height-19px`}>
                        {disabled ? (
                            <h3>
                                {symbol}
                                {formatNumber(value, OPTIONS_NUMBER_FORMAT)}
                            </h3>
                        ) : (
                            <Form>
                                <MoneyInput
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `${field}-input-${index}`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    name={field}
                                    placeholder="0"
                                    prefix={symbol}
                                    withIcon={false}
                                    containerClass="height-19px"
                                    inputClass="padding-0 height-19px"
                                    classesWrapper="w-26.3 height-19px"
                                    value={disabled ? value : totalValues[field as keyof KeysInvoiceCalculates]}
                                    symbols={!!symbolTotal}
                                    disabled={disabled || isDisabledTotals || disabledInputs}
                                    handleChange={({ target: { value: valueNumber } }): void => {
                                        onChange && onChange(eventToNumber(valueNumber.slice(ONE)), field);
                                    }}
                                    onBlur={(e: ChangeEvent): void => {
                                        if (e.target.value) return;
                                        onChange && onChange(defaultPercentageInput(field, 0).values, field);
                                    }}
                                    fixedDecimalScale
                                />
                            </Form>
                        )}
                    </div>
                </Fragment>
            ))}
        </div>
    );
};
