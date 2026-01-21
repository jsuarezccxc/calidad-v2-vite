import React, { useEffect } from 'react';
import dayjs from '@utils/Dayjs';
import usePaginator from '@hooks/usePaginator';
import { ONE } from '@constants/Numbers';
import { ITEMS_PAGE } from '@constants/Paginator';
import { CONTINGENCY_STATE, ContingencyState } from '@constants/ContingencyActivation';
import { isEven } from '@utils/Number';
import { getUnixFromDate } from '@utils/Date';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { Icon } from '@components/icon';
import { Table } from '@components/table';
import { Paginator } from '@components/paginator';
import { DatePickerInput, TimePickerInput } from '@components/table-input';
import { HEADER_TABLE, IContingencyTotal, ITableHistoryProps } from '.';
import './TableHistory.scss';

const ContingencyTotal: React.FC<IContingencyTotal> = props => {
    return (
        <div className="contingency-total">
            <div className="contingency-total__title">Total contingencias</div>
            <div className="contingency-total__count">{props.count}</div>
        </div>
    );
};

export const TableHistory: React.FC<ITableHistoryProps> = ({
    data,
    handleItemDate,
    handleItemTime,
    handleItemEdit,
    isLoadingTable,
}) => {
    const dateToDate = (date: string): Date => dayjs(date, 'YYYY-MM-DD').toDate();

    const { paginator, getLimits } = usePaginator(data);

    useEffect(() => {
        getLimits();
    }, [data]);

    return (
        <>
            <Table
                id={generateId({
                    module: ModuleApp.CONTINGENCY,
                    submodule: `history`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.TBL,
                })}
                isLoading={isLoadingTable}
                headersTable={HEADER_TABLE}
                data={[]}
                className="table-contingency-history"
                customTable
                isNew
            >
                {paginator.dataLimits.map(({ status, isEdit, id, ...item }, index) => {
                    const number = index + ONE;
                    const startDate = dateToDate(item.start_date);
                    const styleTd = `table-contingency-history__body--${isEven(number) ? 'gray' : 'white'}`;
                    return (
                        <tr className="table-contingency-history__body" key={index}>
                            <td className={`${styleTd} table-contingency-history__body__paragraph`}>{number}</td>
                            <td className={`${styleTd}`}>
                                <DatePickerInput selected={getUnixFromDate(startDate)} className="pr-2" disabled />
                            </td>
                            <td className={`${styleTd} px-2 text-sm`}>
                                <TimePickerInput value={item.start_time} disabled />
                            </td>
                            <td className={styleTd}>
                                <DatePickerInput
                                    onChangeDate={(date): void => handleItemDate(id, date)}
                                    selected={getUnixFromDate(dateToDate(item.end_date))}
                                    minDate={new Date()}
                                    disabled={!isEdit}
                                    className="pr-2"
                                />
                            </td>
                            <td className={`${styleTd} px-2 text-sm`}>
                                <TimePickerInput
                                    onChange={(event): void => handleItemTime(id, event)}
                                    value={item.end_time}
                                    disabled={!isEdit}
                                />
                            </td>
                            <td className={`${styleTd} table-contingency-history__body__paragraph`}>{item.description}</td>
                            <td className={`${styleTd} table-contingency-history__body__paragraph`}>
                                {CONTINGENCY_STATE[status]}
                            </td>
                            <td className="table-contingency-history__body__paragraph">
                                {ContingencyState.InProgress === status && (
                                    <Icon name="editBlue" onClick={(): void => handleItemEdit(id, !isEdit)} />
                                )}
                            </td>
                        </tr>
                    );
                })}
            </Table>
            {data.length > ITEMS_PAGE && <Paginator {...paginator} />}
            <ContingencyTotal count={data.length} />
        </>
    );
};
