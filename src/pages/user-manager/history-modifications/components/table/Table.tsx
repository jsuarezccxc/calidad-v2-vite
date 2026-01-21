import React, { ReactElement, useEffect } from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import usePaginator from '@hooks/usePaginator';
import { Text } from '@components/table-input';
import { DatePickerBase } from '@components/date-picker';
import { Table } from '@components/table';
import { Paginator } from '@components/paginator';
import { Icon } from '@components/icon';
import { ITEMS_PAGE } from '@constants/Paginator';
import { IHistoryModifications } from '..';
import './Table.scss';

export const TableModifications: React.FC<IHistoryModifications> = ({ dataTable = [], translate = (): void => {} }) => {
    const { paginator, getLimits } = usePaginator(dataTable);

    useEffect(() => {
        getLimits();
    }, [dataTable]);

    return (
        <>
            <Table
                isHeaderRowsCustom
                customTable
                headerRowsCustom={<HeaderTable translate={translate} />}
                data={[]}
                wrapperClassName="mb-2 table-history-modification"
                className="xs:w-max"
            >
                {dataTable.slice(paginator.limits.start, paginator.limits.finish)?.map((data: IGenericRecord, index: number) => (
                    <React.Fragment key={index}>
                        <tr>
                            <td className="body-table-modifications height-header">
                                <Text
                                    text={data.user}
                                    type="text"
                                    onChange={(): void => {}}
                                    disabled
                                    editTable={false}
                                    className="table-text xs:m-1"
                                />
                            </td>
                            <td className="body-table-modifications height-header">
                                {data.module === 'Usuarios' ? (
                                    <Text
                                        text="Perfil de la empresa"
                                        type="text"
                                        onChange={(): void => {}}
                                        disabled
                                        editTable={false}
                                        className="table-text xs:m-1"
                                    />
                                ) : (
                                    <Text
                                        text={data.module}
                                        type="text"
                                        onChange={(): void => {}}
                                        disabled
                                        editTable={false}
                                        className="table-text xs:m-1"
                                    />
                                )}
                            </td>
                            <td className="body-table-modifications height-header">
                                <div className="flex">
                                    <DatePickerBase selected={data.date} dateFormat="dd/MM/yyyy" disabled />
                                    <Icon name="calendarGray" alt="calendar" className="w-6" />
                                </div>
                            </td>
                            <td className="body-table-modifications height-header">
                                <Text text={data.hour} type="text" onChange={(): void => {}} disabled editTable={false} />
                            </td>
                            <td className="body-table-modifications height-body">
                                <Text
                                    text={data.activity}
                                    type="text"
                                    onChange={(): void => {}}
                                    disabled
                                    editTable={false}
                                    className=" xs:m-1"
                                />
                            </td>
                        </tr>
                    </React.Fragment>
                ))}
            </Table>
            {dataTable.length > ITEMS_PAGE && <Paginator {...paginator} isGroupPaginator numberGroupPaginator={3} />}
        </>
    );
};

export const HeaderTable: React.FC<IGenericRecord> = ({ translate = (): void => {} }): ReactElement => (
    <tr>
        <th className="field-header-history height-header width-user users-module">
            <p className="mt-0 mb-0 ml-auto mr-auto lg:text-sm xs:text-tiny">{translate('fields.user')}</p>
        </th>
        <th className="field-header-history height-header width-module users-module">
            <p className="mt-0 mb-0 ml-auto mr-auto lg:text-sm xs:text-tiny">{translate('fields.module')}</p>
        </th>
        <th className="field-header-history width-date height-header">
            <p className="mt-0 mb-0 ml-auto mr-auto lg:text-sm xs:text-tiny">{translate('fields.date')}</p>
        </th>
        <th className="field-header-history height-header width-hour">
            <p className="mt-0 mb-0 ml-auto mr-auto text-sm leading-none xs:text-tiny xs:px-2">{translate('fields.hour')}</p>
        </th>
        <th className="field-header-history width-action height-header">
            <p className="mt-0 mb-0 ml-auto mr-auto leading-4 lg:text-sm xs:text-tiny xs:leading-3">
                {translate('fields.action')}
            </p>
        </th>
    </tr>
);
