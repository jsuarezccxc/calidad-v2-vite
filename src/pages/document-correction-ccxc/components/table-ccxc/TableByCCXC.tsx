import React, { useEffect } from 'react';
import dayjs from '@utils/Dayjs';
import { Table } from '@components/table';
import { Text } from '@components/table-input';
import { Paginator } from '@components/paginator';
import { ITEMS_PAGE } from '@constants/Paginator';
import { NotFindElements } from '@components/not-find-elements';
import { Tooltip } from '@components/tooltip';
import { Icon } from '@components/icon';
import { lengthGreaterThanZero } from '@utils/Length';
import { IGenericRecord } from '@models/GenericRecord';
import usePaginator from '@hooks/usePaginator';
import usePopper from '@hooks/usePopper';
import { headersTable } from '..';

export const HeaderTableCCXC: React.FC<IGenericRecord> = () => {
    const { anchorEl, togglePopper } = usePopper();

    return (
        <tr className="md:h-10 xs:h-auto">
            {headersTable?.map((item: IGenericRecord, index) => (
                <th key={`${index}-header`} className={`field-header--uneditable ${item.wrapperClassName} py-1 px-2`}>
                    <div
                        id={`${item.title}-table-text`}
                        className={`xs:min-h-7.5 text-sm ${
                            item.showInformation ? 'leading-6' : 'leading-4'
                        } font-allerbold text-left flex xs:p-0 xs:text-tiny text-blue`}
                    >
                        {item.showInformation && (
                            <span onClick={togglePopper} className="pr-2">
                                <Icon name="infoGreen" className="cursor-pointer" />
                            </span>
                        )}
                        {item.title}
                    </div>
                    <Tooltip
                        anchorEl={anchorEl}
                        placement="bottom-start"
                        iconName="infoBlue"
                        title="Descripción del rechazo:"
                        description={item.sectionTooltip}
                        wrapperClassName="tooltip-size"
                    />
                </th>
            ))}
        </tr>
    );
};

export const TableByCCXC: React.FC<IGenericRecord> = ({ data = [] }) => {
    const { paginator, getLimits } = usePaginator(data);

    useEffect(() => {
        getLimits();
    }, [data]);

    return (
        <>
            <Table
                isNew
                data={[]}
                isHeaderRowsCustom
                headerRowsCustom={<HeaderTableCCXC />}
                customTable
                className="correction-table"
            >
                {lengthGreaterThanZero(data) &&
                    data.slice(paginator.limits.start, paginator.limits.finish).map((item: IGenericRecord, idItem: number) =>
                        item.error_histories.map((itemError: IGenericRecord, idError: number) => (
                            <React.Fragment key={`correction-table-${idItem}-${idError}`}>
                                <tr className="text-sm body-row-register xs:text-tiny">
                                    <td className="lg:h-10 field-body--uneditable">
                                        <Text
                                            text={item.number}
                                            type="text"
                                            editTable={false}
                                            disabled
                                            onChange={(): void => {}}
                                        />
                                    </td>
                                    <td className="lg:h-10 field-body--uneditable">
                                        <div className="flex flex-row items-center justify-center w-full h-full">
                                            <Text
                                                text={dayjs(itemError.error_date).format('DD/MM/YYYY')}
                                                type="text"
                                                editTable={false}
                                                disabled
                                                onChange={(): void => {}}
                                            />
                                            <Icon name="calendarGray" alt="calendar" className="w-5.5" />
                                        </div>
                                    </td>
                                    <td className="field-body-rejection field-body--uneditable">
                                        <Text
                                            text={itemError.description}
                                            type="text"
                                            editTable={false}
                                            disabled
                                            onChange={(): void => {}}
                                        />
                                    </td>
                                    <td className="field-body-rejection field-body--uneditable">
                                        <Text
                                            text={itemError.estimated_response_time}
                                            type="text"
                                            editTable={false}
                                            disabled
                                            onChange={(): void => {}}
                                        />
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))
                    )}
            </Table>
            {data?.length > ITEMS_PAGE && <Paginator {...paginator} />}
            {!lengthGreaterThanZero(data) && (
                <div className="lg:-mt-4.5">
                    <NotFindElements customText="Hasta el momento no tiene documentos electrónicos para corregir" withoutData />
                </div>
            )}
        </>
    );
};
