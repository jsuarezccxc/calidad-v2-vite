import React from 'react';
import { classNameTexts, TABLE_HEADERS } from '.';

export const CustomHeaderTable: React.FC = () => {
    return (
        <>
            {TABLE_HEADERS.map((row, rowIndex) => (
                <tr key={rowIndex} className="bg-green-extraLight">
                    {row.map((header, cellIndex) => (
                        <th key={cellIndex} className={header.className} colSpan={header.colSpan || 1}>
                            <p className={header.classNameTexts}>{header.title}</p>
                            {header.amount && header.value && (
                                <div className="flex h-8.75 lg:h-10 px-2">
                                    <p className={`w-29 ${classNameTexts()}`}>{header.amount}</p>
                                    <p className={`w-29 ${classNameTexts()}`}>{header.value}</p>
                                </div>
                            )}
                        </th>
                    ))}
                </tr>
            ))}
        </>
    );
};
