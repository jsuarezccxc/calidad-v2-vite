import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { RootState } from '@redux/rootReducer';
import { getInvoice } from '@redux/rejected-invoices/actions';
import { downloadXml } from '@redux/electronic-invoice/actions';
import { acceptInvoice, getTypesRejections, rejectedInvoice } from '@redux/invoice-summary/actions';
import { IGenericRecord } from '@models/GenericRecord';
import useParam from '@hooks/useParam';
import { Routes } from '@constants/Paths';
import { ID } from '@constants/BuildProduct';
import { VALUE_ZERO } from '@constants/ElectronicInvoice';
import { ZERO } from '@constants/Numbers';
import { Button } from '@components/button';
import { ModalType } from '@components/modal-custom';
import { InvoiceViewer } from '@components/invoice-viewer';
import { FileInput, IFile, SelectSearchInput, TextArea } from '@components/input';
import { DownloadIcons, Icon } from '@components/icon';
import { getRoute, getRouteName } from '@utils/Paths';
import {
    DOCUMENTS_SUPPORTED,
    fileInputProps,
    refactorPostData,
    modalProps,
    initialInputs,
    buildOptionsRejections,
    ClientState,
    DOCUMENT_ACCEPTED,
    DOCUMENT_REJECTED,
} from '.';
import './InvoiceSummary.scss';

const InvoiceSummary: React.FC = () => {
    const dispatch = useDispatch();
    const invoiceId = useParam(ID);
    const companyId = useParam('company_id');
    const { pathname } = useLocation();
    const {
        invoiceSummary: { reasonRejections },
        rejectedInvoices: { invoice },
    } = useSelector((state: RootState) => state);
    const isRejected: boolean = pathname === getRoute(Routes.REJECT_INVOICE);
    const [initialInputsData, setInitialInputsData] = useState<IGenericRecord>(initialInputs);
    const [pageTitle, setPageTitle] = useState(
        pathname === getRoute(Routes.INVOICE_SUMMARY) ? getRouteName(Routes.INVOICE_SUMMARY) : getRouteName(Routes.REJECT_INVOICE)
    );
    const [file, setFile] = useState<IFile>([{ name: DOCUMENTS_SUPPORTED, files: [] }]);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [checkError, setCheckError] = useState<IGenericRecord>({
        reason: false,
        observation: false,
    });
    useEffect(() => {
        isRejected && dispatch(getTypesRejections());
        dispatch(getInvoice(invoiceId.queryParam, false, companyId.queryParam));
    }, []);

    useEffect(() => {
        if (!invoice) return;

        const rejection = invoice.rejected_invoices?.[ZERO];

        const reasonRejection = rejection
            ? [
                  {
                      id: rejection.reason_rejection_id,
                      code_credit_note: rejection.code_credit_note,
                      code_debit_note: rejection.code_debit_note,
                      description: rejection.reason_rejection_description,
                      required: false,
                      label: true,
                      temporary_id: uuid(),
                  },
              ]
            : initialInputs.reason_rejection;

        const observationRejection = rejection
            ? {
                  value: rejection.observation,
                  required: false,
              }
            : initialInputs.observation;

        setInitialInputsData({
            reason_rejection: reasonRejection,
            observation: observationRejection,
        });

        if (!isRejected && invoice.answer_client === ClientState.VERIFICATION) dispatch(acceptInvoice(invoiceId.queryParam));

        setDisabled(invoice.answer_client === ClientState.REJECTED || invoice.answer_client === ClientState.ACCEPT);

        if (invoice.answer_client && invoice.answer_client !== ClientState.VERIFICATION)
            setPageTitle(invoice.answer_client === ClientState.REJECTED ? DOCUMENT_ACCEPTED : DOCUMENT_REJECTED);
    }, [invoice]);

    const pdfUrl = useMemo(() => invoice.invoice_pdf_url || invoice.pdf_url, [invoice]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setCheckError({
            ...checkError,
            observation: false,
        });

        setInitialInputsData({
            ...initialInputsData,
            [e.target.name]: {
                value: e.target.value,
                required: !e.target.value,
            },
        });
    };

    const download = async (): Promise<void> => {
        await dispatch(downloadXml(invoice.file_name_extension, false, invoice.xml_token));
    };

    const checkInputs = (): IGenericRecord => {
        for (let i = 0; i < initialInputsData.reason_rejection.length; i++) {
            if (initialInputsData.reason_rejection[i].required) {
                return {
                    required: true,
                };
            }
        }
        return {
            check: true,
        };
    };

    const handleClick = async (): Promise<void> => {
        if (!initialInputsData.observation.required && checkInputs().check) {
            await dispatch(rejectedInvoice(refactorPostData(initialInputsData, invoiceId.queryParam), file));
            setShowModal(!showModal);
            setDisabled(!disabled);
        }
        if (checkInputs().required) {
            setCheckError({
                reason: true,
                observation: true,
            });
        }
        if (initialInputsData.observation.required && !checkInputs().required) {
            setCheckError({
                ...checkError,
                observation: true,
            });
        }
    };

    const handleChangeSelect = (option: IGenericRecord, id: string): void => {
        setInitialInputsData({
            ...initialInputsData,
            reason_rejection: initialInputsData['reason_rejection'].map((item: IGenericRecord, index: number) => {
                if (item.temporary_id === id) {
                    let isRepeated = false;
                    initialInputsData['reason_rejection'].forEach((value: IGenericRecord) => {
                        if (value.id === option.id) isRepeated = true;
                    });
                    return {
                        ...initialInputsData['reason_rejection'][index],
                        id: option.id,
                        code_debit_note: option.unitMeasure,
                        code_credit_note: option.code,
                        description: option.value,
                        required: isRepeated,
                        repeated: isRepeated,
                        textRequired: isRepeated && '*No puede seleccionar dos veces el mismo motivo.',
                    };
                }
                return initialInputsData['reason_rejection'][index];
            }),
        });
    };

    const deleteReasonRejection = (id: string): void => {
        !disabled &&
            setInitialInputsData({
                ...initialInputsData,
                reason_rejection: initialInputsData['reason_rejection'].filter(
                    (item: IGenericRecord) => item.temporary_id !== id
                ),
            });
    };

    const optionsReasonsReject = buildOptionsRejections(reasonRejections).map(item => ({ ...item, name: item.value }));

    return (
        <div className="body invoice-summary-container">
            <ModalType {...modalProps(showModal, setShowModal)} />
            <div className="lg:ml-20">
                <h1 className="text-xl mb-6.75 xs:mb-8.4 text-green font-allerbold">{pageTitle}</h1>

                <InvoiceViewer
                    invoicePDFUrl={pdfUrl}
                    isPDF
                    text="documento electrónico"
                    classesDownloadIcon={isRejected ? 'lg:hidden' : ''}
                    downloadXml={download}
                />
            </div>
            {isRejected && (
                <div className="lg:mt-12 lg:flex xs:flex-col">
                    <div className="lg:w-120">
                        <div className="text-base text-gray-dark xs:mt-2">
                            Si tiene más de un motivo para rechazar la factura de venta, elija la opción{' '}
                            <span className="font-allerbold">Otros</span> y en el campo de observaciones especifique de forma
                            detallada las razones por las cuales rechazó la factura.
                        </div>
                        <div className="mt-4.5 lg:w-full">
                            {initialInputsData.reason_rejection?.map((item: IGenericRecord, index: number) => {
                                const isGreaterThanZero = index > Number(VALUE_ZERO);
                                return (
                                    <div key={index} className={`${isGreaterThanZero ? 'mt-3' : ''}`}>
                                        <div className="flex">
                                            <div className="flex">
                                                <SelectSearchInput
                                                    labelText={
                                                        item.label &&
                                                        'Seleccione el motivo por el cual rechazó el documento electrónico en la lista desplegable'
                                                    }
                                                    placeholder="Seleccionar"
                                                    classesInput="w-10"
                                                    classIconSearch="top-11 right-0.5"
                                                    classesWrapper="w-73 xs:w-full"
                                                    optionSelect={optionsReasonsReject}
                                                    disabled={disabled}
                                                    onChangeSelect={(_, option): void =>
                                                        handleChangeSelect(option, item.temporary_id)
                                                    }
                                                    requiredText={item.textRequired || '*Campo obligatorio'}
                                                    valueSelect={item.description}
                                                    required={checkError.reason ? item.required : item.repeated}
                                                />
                                                {!index && (
                                                    <DownloadIcons
                                                        className={isRejected ? 'ml-4.5 xs:hidden' : 'hidden'}
                                                        pdfUrl={pdfUrl}
                                                        downloadXml={download}
                                                    />
                                                )}
                                            </div>
                                            {isGreaterThanZero && (
                                                <React.Fragment>
                                                    <Icon
                                                        name="trashBlue"
                                                        hoverIcon="trashGreen"
                                                        className={`lg:ml-2 ${disabled && 'hidden'} ${
                                                            item.repeated && '-mt-4'
                                                        } cursor-pointer`}
                                                        onClick={(): void => deleteReasonRejection(item.temporary_id)}
                                                    />
                                                </React.Fragment>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="mt-4.5">
                                <TextArea
                                    labelText="Para agregar observaciones sobre el rechazo inclúyalas en este campo de texto:"
                                    placeholder="Escriba las observaciones aquí"
                                    classesInput="textarea"
                                    classesWrapper="w-73 xs:w-full"
                                    disabled={disabled}
                                    value={initialInputsData.observation.value}
                                    required={checkError.observation ? initialInputsData.observation.required : false}
                                    name="observation"
                                    onChange={(e): void => handleChange(e)}
                                />
                            </div>
                            <div className="mt-4.5">
                                <FileInput {...fileInputProps(DOCUMENTS_SUPPORTED, file, setFile)} disabled={disabled} />
                            </div>
                        </div>
                        {!disabled && (
                            <div className="mt-4.5 flex flex-col xs:flex-col-reverse xs:items-center">
                                <Button
                                    text="Enviar rechazo"
                                    classes={`button ${disabled && 'button-disabled'} `}
                                    onClick={handleClick}
                                    disabled={disabled}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoiceSummary;
