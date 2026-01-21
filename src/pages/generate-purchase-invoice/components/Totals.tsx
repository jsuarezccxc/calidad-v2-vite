import React, { useEffect, useMemo } from 'react';
import { createNewJson } from '@utils/Json';
import { calculateTotal } from '@utils/Calculate';
import { stringToFloat } from '@utils/ElectronicInvoice';
import { IGenericRecord } from '@models/GenericRecord';
import { IElectronicDocumentTotals } from '@models/ElectronicNote';
import { IBUA, ICUI, INC, IVA } from '@constants/BuildProduct';
import { ITotalsProps, TOTAL_FIELDS, TOTALS } from '.';

interface ITotals extends IElectronicDocumentTotals {
    taxes: IGenericRecord;
}

export const Totals: React.FC<ITotalsProps> = ({ data, symbol, onTotalsCalculated }) => {
    const taxTotal = (taxes: IGenericRecord, tax: string): number =>
        calculateTotal(Object.keys(taxes).map(name => (name.includes(tax) ? taxes[name] : 0)));

    const formatMoney = (value: number): string =>
        `${symbol}${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2 }).format(value)}`;

    const getTotals = (): { formatted: IGenericRecord; raw: IGenericRecord } => {
        const totals: ITotals = createNewJson(TOTALS);
        data.forEach(({ total_buy, ...item }) => {
            totals.total_sale += item.unit_value;
            totals.total_discount += item.discount;
            totals.total_invoice += total_buy;
            totals.total_sale_before_tax += total_buy;
            if (item.product_taxes.length) {
                item.product_taxes.forEach(({ tax_rate, tax_name, ...tax }) => {
                    const isBUA = tax_name === IBUA;
                    const taxKey = tax_rate && !isBUA ? `${tax_name}_${tax_rate}%` : tax_name;
                    const taxValue = isBUA ? stringToFloat(item.quantity) * tax.tax_value : (total_buy * tax_rate) / 100;
                    totals.taxes[taxKey] = (totals.taxes[taxKey] || 0) + taxValue;
                });
            }
        });
        const total: number = calculateTotal(Object.values(totals.taxes)) + totals.total_invoice;
        const formatted: IGenericRecord = {
            total_sale: formatMoney(totals.total_sale),
            total_discount: formatMoney(totals.total_discount),
            total: formatMoney(total),
            ...Object.fromEntries(Object.entries(totals.taxes).map(([key, value]) => [key, formatMoney(value)])),
        };
        const raw: IGenericRecord = {
            ...totals,
            total_iva: taxTotal(totals.taxes, IVA),
            total_impoconsumption: taxTotal(totals.taxes, INC),
            total_inc: taxTotal(totals.taxes, INC),
            total_icui: taxTotal(totals.taxes, ICUI),
            total_ibua: taxTotal(totals.taxes, IBUA),
            total,
        };
        delete raw.taxes;
        return { formatted, raw };
    };

    const totals = useMemo(() => getTotals(), [data, symbol]);

    useEffect(() => {
        if (onTotalsCalculated) {
            onTotalsCalculated(totals.raw);
        }
    }, [totals.raw, onTotalsCalculated]);

    return (
        <section>
            {TOTAL_FIELDS.map(({ field, name }, index) => (
                <p
                    className={`text-blue flex gap-4.5 mb-0.5 ${index === TOTAL_FIELDS.length - 1 ? 'font-allerbold' : ''}`}
                    key={field}
                >
                    <span style={{ width: '9.8125rem' }}>{field}</span>
                    <span>{totals.formatted[name] ?? `${symbol} 0,00`}</span>
                </p>
            ))}
        </section>
    );
};
