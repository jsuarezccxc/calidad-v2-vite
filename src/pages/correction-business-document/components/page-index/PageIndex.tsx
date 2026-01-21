import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import dayjs from '@utils/Dayjs';
import { BreadCrumb } from '@components/bread-crumb';
import { PageTitle } from '@components/page-title';
import { Routes } from '@constants/Paths';
import { getRoute, getRouteName } from '@utils/Paths';
import { Information } from '@components/information';
import { CORRECTION_BUSINESS_DOCUMENT } from '@information-texts/CorrectionBusinessDocument';
import { DatePickerDayInput } from '@components/input';
import RejectionTable from '../rejection-table';
import { IDataTable, routes } from '../../';
import { getFile } from '@redux/user/actions';
import { downloadIconsProps, getRequestFile } from '@utils/DownloadFile';
import { DownloadIcons } from '@components/icon';
import { getGeneralInvoices } from '@redux/correction-business-document/actions';
import { getUnixFromDate } from '@utils/Date';
import { Form } from '@components/form';
import './PageIndex.scss';

const PageIndex: React.FC<IDataTable> = ({ data = [], dateInput = 0, setDateInput = (): void => {} }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getGeneralInvoices(false, dateInput));
    }, [dateInput]);

    const downloadFile = (type: string): void => {
        dispatch(
            getFile(
                getRequestFile(type, 'electronic-document-correction-report', data, { start_date: dateInput, finish_date: 0 }),
                'Corrección de documentos electrónicos de la DIAN por parte del empresario'
            )
        );
    };

    return (
        <div className="flex flex-col h-full">
            <PageTitle title={getRouteName(Routes.ELECTRONIC_INVOICE)} />
            <BreadCrumb routes={routes()} />
            <Information
                title={CORRECTION_BUSINESS_DOCUMENT().TITLE}
                description={CORRECTION_BUSINESS_DOCUMENT(getRoute(Routes.HOME)).DESCRIPTION}
            />
            <div className="my-4.5">
                <h2 className="mb-3 text-base font-allerbold text-blue">Documentos pendientes por corregir ({data.length})</h2>
                <div className="flex justify-between xs:flex-col">
                    <Form className="flex flex-row h-auto w-38 xs:w-full">
                        <DatePickerDayInput
                            labelText="Fecha emisión:"
                            selected={dateInput}
                            onChangeDate={(date: Date): void => setDateInput(getUnixFromDate(date))}
                            classesWrapper="w-38 xs:w-full"
                            classesInput="padding-6"
                            maxDate={dayjs().toDate()}
                        />
                    </Form>
                    <DownloadIcons download={downloadIconsProps(downloadFile).download} className="xs:mt-4.5 xs:-mb-6" />
                </div>
            </div>
            <div>
                <RejectionTable data={data} invoiceType={''} />
            </div>
        </div>
    );
};

export default PageIndex;
