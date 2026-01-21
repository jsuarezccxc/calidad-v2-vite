import React from 'react';
import FileSaver from 'file-saver';
import { Document, Page } from 'react-pdf';
import { Button } from '@components/button';
import { TextInput } from '@components/input';
import { IGenericRecord } from '@models/GenericRecord';
import { Table } from '@components/table';
import { headerTableSupport } from '@pages/correction-documents-client-employer';
import { lengthGreaterThanZero } from '@utils/Length';
import { isObjEmpty } from '@pages/correction-business-document/components/invoice-correction';
import { NotFindElements } from '@components/not-find-elements';
import './VisualizationElectronicDocument.scss';

export const VisualizationElectronicDocument: React.FC<IGenericRecord> = ({
    invoice = {},
    handleInvoiceDisplay = (): void => {},
    handleGenerateRejection = (): void => {},
    handleAgreement = (): void => {},
}) => {
    const setReasonRejection = (): string => {
        let formatReasons = '';
        invoice.reason_rejections?.forEach((reason: IGenericRecord, index: number) => {
            formatReasons += `${index !== 0 ? reason.reason_rejection_name.toLowerCase() : reason.reason_rejection_name}${
                index + 1 < invoice.reason_rejections.length ? ',' : ''
            } `;
        });
        return formatReasons;
    };

    return (
        <div className="visualization-container">
            {isObjEmpty(invoice) ? (
                <div className="xs:-mb-5">
                    <NotFindElements customText="Hasta el momento no tiene documentos rechazados por sus clientes" withoutData />
                </div>
            ) : (
                <React.Fragment>
                    <div className="mt-8 mb-2">
                        <div className="flex xs:flex-col">
                            <div>
                                <p className="text-base font-allerbold text-blue">Razones de rechazo por parte del cliente</p>
                                <div className="w-full lg:w-73">
                                    <TextInput
                                        labelText="Nombre del cliente"
                                        classesWrapperInput="border-none"
                                        name="name"
                                        placeholder="...."
                                        classesWrapper="mt-4.5"
                                        disabled
                                        value={invoice?.client_name}
                                    />
                                    <TextInput
                                        labelText="Correo electrónico del cliente:"
                                        classesWrapperInput="border-none"
                                        name="email"
                                        placeholder="...."
                                        classesWrapper="mt-4.5"
                                        disabled
                                        value={invoice?.client_email}
                                    />
                                    <TextInput
                                        labelText="Teléfono del cliente:"
                                        classesWrapperInput="border-none"
                                        name="phone"
                                        placeholder="...."
                                        classesWrapper="mt-4.5"
                                        disabled
                                        value={invoice?.client_phone}
                                    />
                                    <TextInput
                                        labelText="Motivo de rechazo:"
                                        classesWrapperInput="border-none"
                                        name="reason"
                                        placeholder="...."
                                        classesWrapper="mt-4.5"
                                        disabled
                                        value={setReasonRejection()}
                                    />
                                    <div className="mt-4.5">
                                        <label className="ml-1.5 mb-1 font-allerbold text-blue text-tiny ">Observaciones</label>
                                        <div className="px-2 py-1.5 text-sm rounded-lg bg-gray-light min-h-8">
                                            <>
                                                <ol className="ml-4">
                                                    {lengthGreaterThanZero(invoice?.reason_rejections) &&
                                                        invoice?.reason_rejections.map(
                                                            (reason: IGenericRecord, index: number) => (
                                                                <li key={index}>{reason.observation}</li>
                                                            )
                                                        )}
                                                </ol>
                                            </>
                                        </div>
                                    </div>
                                    <div className="mt-8 w-73 xs:w-full">
                                        <Table headersTable={headerTableSupport} isNew customTable data={[]} className="w-full">
                                            {lengthGreaterThanZero(invoice?.reason_rejections[0]?.rejected_support) &&
                                                invoice?.reason_rejections[0]?.rejected_support.map(
                                                    (value: IGenericRecord, index: number) => {
                                                        const fileName = value?.bucket_data?.file_original_name;
                                                        const fileUrl = value?.bucket_data?.url;
                                                        const type = value?.bucket_data?.file_type.split('/')[1];
                                                        return (
                                                            <tr key={index}>
                                                                <td className="field-body--editable w-full h-10 xs:h-8.2 text-sm xs:text-tiny">
                                                                    <div className="flex justify-between px-1.5 items-center ">
                                                                        <span className="cursor-default ">
                                                                            {fileName.length > 20 ? (
                                                                                <>{`${fileName.slice(0, 20)}...${type}`}</>
                                                                            ) : (
                                                                                <>{fileName}</>
                                                                            )}
                                                                        </span>
                                                                        <button
                                                                            className="px-4 py-px no-underline bg-gray-light font-allerbold rounded-xl text-blue"
                                                                            onClick={(): void => {
                                                                                FileSaver.saveAs(fileUrl, fileName);
                                                                            }}
                                                                            type="button"
                                                                        >
                                                                            descargar
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                        </Table>
                                        {!lengthGreaterThanZero(invoice?.reason_rejections[0]?.rejected_support) && (
                                            <NotFindElements withoutData customText="No cuenta con soportes disponibles." />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="lg:flex lg:-mt-2 xs:mt-4.5 lg:ml-8.4">
                                <div className="actions__preview">
                                    <Document file={invoice?.invoice_pdf_url} className="w-full h-full">
                                        <Page pageNumber={1} className="w-full h-full" />
                                    </Document>
                                    <div className="actions__preview--pdf" />
                                </div>
                                <div className="lg:ml-4.5">
                                    <div className="flex xs:justify-center lg:flex-col">
                                        <Button
                                            text="Aceptar rechazo"
                                            classes="lg:mb-4.5"
                                            onClick={(): void => handleInvoiceDisplay()}
                                        />

                                        <Button
                                            text={invoice.is_send_email ? 'Acuerdo con el cliente' : 'No aceptar rechazo'}
                                            classes="ml-5 lg:ml-0"
                                            onClick={
                                                invoice.is_send_email
                                                    ? (): void => handleAgreement(invoice)
                                                    : (): void => handleGenerateRejection()
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )}
        </div>
    );
};
