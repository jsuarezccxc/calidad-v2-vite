import React, { useMemo } from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import { formatMoney } from '@utils/Decimals';
import { isEven } from '@utils/Number';

export const TableFooter: React.FC<{ data: IGenericRecord[] }> = ({ data }) => {
    const getTotals = (data: IGenericRecord[]): IGenericRecord => {
        const totals = { electronicDocuments: data.length, soldUnits: 0, totalSale: 0 };

        data.forEach(item => {
            totals.soldUnits += item.number_sold;
            totals.totalSale += item.total ?? 0;
        });

        return { ...totals, totalSale: formatMoney(totals.totalSale) };
    };

    const { electronicDocuments, soldUnits, totalSale } = useMemo(() => getTotals(data), [data]);

    return (
        <tr className={isEven(electronicDocuments + 1) ? 'bg-white' : 'bg-gray-light'}>
            <td className="leading-none table-text-blue table-field font-allerbold">Total documentos electrónicos</td>
            <td className="table-field table-text-blue font-allerbold" colSpan={2}>
                {electronicDocuments}
            </td>
            <td className="table-field table-text-blue font-allerbold">{soldUnits}</td>
            <td className="table-field table-text-blue font-allerbold">{totalSale}</td>
            <td colSpan={2} />
        </tr>
    );
};
