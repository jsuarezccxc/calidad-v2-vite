import React from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import { isEven } from '@utils/Number';
import { NO_QUANTITIES } from '..';

export const InventoryTable: React.FC<IGenericRecord> = ({ totalUnits = 0, warehouseUnits = [] }) => {
    return (
        <table className="table-inventory__container">
            <thead>
                <tr className="h-10 border-b border-gray">
                    <th className="pl-2 text-sm text-left bg-green-extraLight font-aller text-blue">
                        Total cantidades disponibles para la venta
                    </th>
                    <th className="w-32 pr-2 text-right bg-white text-gray-dark">{totalUnits}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td
                        colSpan={2}
                        className="h-10 pl-2 text-sm text-left border-b bg-green-extraLight border-gray font-aller text-blue"
                    >
                        Total cantidades disponibles para la venta por bodega
                    </td>
                </tr>
                {warehouseUnits?.map((warehouse: IGenericRecord, index: number) => (
                    <tr key={index} className={`h-10 border-b border-gray ${isEven(index) ? 'bg-white' : 'bg-gray-light'}`}>
                        <td className="pl-2 text-sm text-left font-aller text-gray">
                            Cantidades disponibles de {warehouse.name}
                        </td>
                        <td className="pr-2 text-right text-gray">{isNaN(warehouse.units) ? NO_QUANTITIES : warehouse.units}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
