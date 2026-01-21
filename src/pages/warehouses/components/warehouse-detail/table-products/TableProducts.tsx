import React, { useEffect } from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import { Paginator } from '@components/paginator';
import { ITEMS_PAGE } from '@constants/Paginator';
import { Text } from '@components/table-input';
import usePaginator from '@hooks/usePaginator';
import { getDateFromUnix } from '@utils/Date';
import { Table } from '@components/table';
import { ONE_POSITION_TABLE } from '.';

export const TableProducts: React.FC<IGenericRecord> = ({ data }) => {
    const { paginator, getLimits } = usePaginator(data);

    useEffect(() => {
        getLimits();
    }, [data]);

    return (
        <div>
            <Table
                isHeaderRowsCustom
                headerRowsCustom={<TableHeader />}
                data={[]}
                customTable
                className="warehouse-detail__table-container"
                wrapperClassName="warehouse-detail__table-wrapper"
            >
                {data?.slice(paginator?.limits.start, paginator?.limits.finish).map((product: IGenericRecord, index: number) => (
                    <tr key={product.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-light'}`}>
                        <td className="h-10 border-b border-gray">
                            <Text
                                text={String(index + ONE_POSITION_TABLE)}
                                disabled
                                type="text"
                                editTable={false}
                                className="p-2 text-sm text-gray font-aller"
                            />
                        </td>
                        <td className="border-b border-gray">
                            <Text
                                text={product.name}
                                disabled
                                type="text"
                                editTable={false}
                                className="p-2 text-sm cursor-pointer text-gray font-aller"
                            />
                        </td>
                        <td className="border-b border-gray">
                            <Text
                                text={getDateFromUnix(product.last_movement).formattedDate || ''}
                                disabled
                                type="text"
                                editTable={false}
                                className="p-2 text-sm text-gray font-aller"
                            />
                        </td>
                        <td className="border-b border-gray">
                            <Text
                                text={product.quantity}
                                disabled
                                type="text"
                                editTable={false}
                                className="p-2 text-sm text-gray font-aller"
                            />
                        </td>
                    </tr>
                ))}
            </Table>
            {data && data?.length > ITEMS_PAGE && <Paginator {...paginator} />}
        </div>
    );
};

const TableHeader: React.FC = () => (
    <tr>
        <th className="warehouse-detail__table-n">N°</th>
        <th className="warehouse-detail__table-name">Productos y/o servicios</th>
        <th className="warehouse-detail__table-last-movement">Ultimo movimiento</th>
        <th className="warehouse-detail__table-quantity">Cantidad</th>
    </tr>
);
