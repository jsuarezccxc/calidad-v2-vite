import React, { ReactElement } from 'react';
import { Text, NumberFormatInput } from '@components/table-input';
import { IFooterTable } from '@pages/client-portal';

export const CustomFooter: React.FC<IFooterTable> = ({ data = [] }): ReactElement => {
    return (
        <tr className="bg-white text-blue h-10 xs:h-8.2">
            <td>
                <Text
                    text="Total"
                    type="text"
                    disabled
                    onChange={(): void => {}}
                    editTable={false}
                    className="text-sm text-blue font-allerbold"
                />
            </td>
            <td>
                <p className="text-sm text-blue font-allerbold">{data.length || 0} </p>
            </td>
            <td colSpan={2}></td>
            <td>
                <NumberFormatInput
                    inputClass="total total-height text-blue font-allerbold"
                    value={data?.reduce((prev, current) => {
                        return prev + current?.total;
                    }, 0)}
                    disabled
                />
            </td>
        </tr>
    );
};
