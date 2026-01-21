import React from 'react';
import { useHistory } from 'react-router';
import { Information } from '@components/information';
import { Table } from '@components/table';
import { CORRECTION_BUSINESS_DOCUMENT } from '@information-texts/CorrectionBusinessDocument';
import { COMPONENT, getTypeInvoice, IDataTable, TypeComponent } from '@pages/correction-business-document';
import { IGenericRecord } from '@models/GenericRecord';
import { DatePickerBase } from '@components/date-picker';
import { Icon } from '@components/icon';
import { Link, LinkColor } from '@components/button';
import { NotFindElements } from '@components/not-find-elements';
import { lengthEqualToZero } from '@utils/Length';
import { headersTable } from '.';

import './ResumeTable.scss';

const ResumeTable: React.FC<IDataTable> = ({ data = [] }) => {
    const [history] = [useHistory()];

    const onClick = (item: IGenericRecord): void => {
        history.push(`?${COMPONENT}=${TypeComponent.INVOICE_CORRECTION}&id=${item.id}&view=${true}`);
    };

    return (
        <div className="xs:mt-5 lg:mt-8.4">
            <Information
                title={CORRECTION_BUSINESS_DOCUMENT().TITLE_RESUME_TABLE}
                color="blue"
                description={CORRECTION_BUSINESS_DOCUMENT().DESCRIPTION_RESUME_TABLE}
            />
            <Table data={[]} headersTable={headersTable} className="mt-5" customTable>
                {data.map((item: IGenericRecord) => (
                    <React.Fragment key={item.id}>
                        <tr className="text-sm xs:text-tiny">
                            <td className="field-body-resume field-body--uneditable">
                                {getTypeInvoice(item.invoice_type).abbreviation}
                            </td>
                            <td className="field-body-resume field-body--uneditable">
                                <Link
                                    href={`?${COMPONENT}=${TypeComponent.VIEW_INVOICE}&id=${item.id}`}
                                    text={String(item.consecutive.number)}
                                    linkColor={LinkColor.PURPLE}
                                />
                            </td>
                            <td className="field-body--uneditable">
                                <div className="flex flex-row justify-center h-full date-picker xs:ml-10">
                                    <DatePickerBase
                                        dateFormat="dd/MM/yyyy"
                                        className="bg-gray-light"
                                        selected={item?.date}
                                        disabled
                                    />
                                    <Icon name="calendarGray" alt="calendar" className="w-6 xs:mr-4.5 xs:-mt-px" />
                                </div>
                            </td>
                            <td className="field-body-resume field-body--uneditable">
                                <div className="flex flex-col gap-y-2">
                                    {item.error_histories.map((error: IGenericRecord) => (
                                        <div key={error.id}>{error.code}</div>
                                    ))}
                                </div>
                            </td>
                            <td className="field-body-resume field-body--uneditable w-96">
                                <div className="flex flex-col underline cursor-pointer text-purple hover:text-blue gap-y-2">
                                    {item.error_histories.map((error: IGenericRecord) => (
                                        <div key={error.id} onClick={(): void => onClick(item)}>
                                            {error.description}
                                        </div>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    </React.Fragment>
                ))}
            </Table>
            {lengthEqualToZero(data) && (
                <NotFindElements customText="Hasta el momento no ha corregido ningún documento" withoutData />
            )}
        </div>
    );
};

export default ResumeTable;
