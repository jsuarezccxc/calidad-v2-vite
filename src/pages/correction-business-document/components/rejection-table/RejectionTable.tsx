import React, { useEffect } from 'react';
import { Table } from '@components/table';
import { IGenericRecord } from '@models/GenericRecord';
import { COMPONENT, IDataTable, TypeComponent } from '@pages/correction-business-document';
import { headersTable } from '.';
import { Link, LinkColor } from '@components/button';
import { lengthGreaterThanZero } from '@utils/Length';
import { getDateFromUnix } from '@utils/Date';
import { NotFindElements } from '@components/not-find-elements';
import { NumberFormatInput, Text } from '@components/table-input';
import { ITEMS_PAGE } from '@constants/Paginator';
import { Paginator } from '@components/paginator';
import usePaginator from '@hooks/usePaginator';
import './RejectionTable.scss';

const RejectionTable: React.FC<IDataTable> = ({ data = [], invoiceType = '' }) => {
    const { paginator, getLimits } = usePaginator(data);

    useEffect(() => {
        getLimits();
    }, [data]);

    return (
        <>
            <p className="mb-4.5 text-tiny text-blue font-allerbold">{invoiceType}</p>
            <Table data={[]} headersTable={headersTable} customTable className="w-max">
                {lengthGreaterThanZero(data) &&
                    data.slice(paginator.limits.start, paginator.limits.finish).map((item: IGenericRecord, idItem: number) =>
                        item.error_histories.map((itemError: IGenericRecord, idError: number) => (
                            <React.Fragment key={`correction-table-${idItem}-${idError}`}>
                                <tr className="text-sm xs:text-tiny">
                                    {idError === 0 && (
                                        <>
                                            <td className="lg:h-10 field-body--uneditable" rowSpan={item.error_histories.length}>
                                                <Text
                                                    text={item.invoice_type}
                                                    type="text"
                                                    editTable={false}
                                                    disabled
                                                    onChange={(): void => {}}
                                                />
                                            </td>
                                            <td className="lg:h-10 field-body--uneditable" rowSpan={item.error_histories.length}>
                                                <Text
                                                    text={item.number}
                                                    type="text"
                                                    editTable={false}
                                                    disabled
                                                    onChange={(): void => {}}
                                                />
                                            </td>
                                            <td className="lg:h-10 field-body--uneditable" rowSpan={item.error_histories.length}>
                                                <Text
                                                    text={item.name}
                                                    type="text"
                                                    editTable={false}
                                                    disabled
                                                    onChange={(): void => {}}
                                                />
                                            </td>
                                            <td className="lg:h-10 field-body--uneditable" rowSpan={item.error_histories.length}>
                                                <Text
                                                    text={getDateFromUnix(item.date).dateFormat}
                                                    type="text"
                                                    editTable={false}
                                                    disabled
                                                    onChange={(): void => {}}
                                                />
                                            </td>
                                            <td className="lg:h-10 field-body--uneditable" rowSpan={item.error_histories.length}>
                                                <NumberFormatInput value={item.total} disabled onChange={(): void => {}} />
                                            </td>
                                        </>
                                    )}
                                    <td className="lg:h-10 field-body--uneditable">
                                        <Text
                                            text={itemError.code}
                                            type="text"
                                            editTable={false}
                                            disabled
                                            onChange={(): void => {}}
                                        />
                                    </td>
                                    <td className="field-body-rejection w-120 field-body--uneditable">
                                        <Text
                                            text={itemError.description}
                                            type="text"
                                            editTable={false}
                                            disabled
                                            onChange={(): void => {}}
                                        />
                                    </td>
                                    {idError === 0 && (
                                        <td
                                            className="field-body-rejection field-body--uneditable"
                                            rowSpan={item.error_histories.length}
                                        >
                                            <Link
                                                text="Corregir"
                                                href={`?${COMPONENT}=${TypeComponent.INVOICE_CORRECTION}&id=${item.id}`}
                                                linkColor={LinkColor.PURPLE}
                                                classes="lg:text-sm xs:text-tiny"
                                            />
                                        </td>
                                    )}
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
export default RejectionTable;
