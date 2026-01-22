import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FileSaver from 'file-saver';
import { getInformationCompany } from '@redux/company/actions';
import { sendEmailTemplate } from '@redux/quotes/actions';
import {
    getDocumentRequireCorrection,
    getHistoryCorrectionDocumentsClient,
    setConsecutive,
} from '@redux/correction-documents-client-employer/actions';
import { RootState } from '@redux/rootReducer';
import { getUtilsData } from '@redux/correction-business-document/actions';
import { getUniqueProductStock, setAgreement, setSelectedDocument } from '@redux/electronic-invoice/actions';
import useInvoice from '@hooks/useInvoice';
import useParam from '@hooks/useParam';
import { getRoute, getRouteName } from '@utils/Paths';
import { buttonsFooterProps } from '@utils/Button';
import { lengthGreaterThanZero } from '@utils/Length';
import { ModuleApp } from '@utils/GenerateId';
import { IGenericRecord } from '@models/GenericRecord';
import { Routes } from '@constants/Paths';
import { PDF } from '@constants/DownloadFile';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import EditEmailTemplate from '@pages/edit-email-template/EditEmailTemplate';
import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { Icon } from '@components/icon';
import { VisualizationElectronicDocument, VisualizationCorrectionDocument } from './components';
import { routes, initFields, invoiceId, routesEmailTemplate } from '.';
import './CorrectionDocumentsClientEmployer.scss';

const CorrectionDocumentsClientEmployer: React.FC = () => {
    const [history, dispatch, param, { downloadXML }] = [useHistory(), useDispatch(), useParam(invoiceId), useInvoice()];

    const {
        correctionDocumentsClientEmployer: { historyDocuments, invoiceCorrection, reasonRejections },
    } = useSelector((state: RootState) => state);
    const [selectInvoice, setInvoice] = useState<IGenericRecord>({});
    const [viewDocument, setViewDocument] = useState({ show: false, document: {}, number: '' });
    const [viewCorrection, setViewCorrection] = useState(false);
    const [acceptRejection, setAcceptRejection] = useState(false);
    const [generateRejection, setGenerateRejection] = useState(false);
    const [fields] = useState(initFields(false));

    useEffect(() => {
        (async (): Promise<void> => {
            await Promise.all([
                dispatch(getHistoryCorrectionDocumentsClient()),
                dispatch(setConsecutive()),
                dispatch(getUtilsData()),
                dispatch(getUniqueProductStock()),
                dispatch(getDocumentRequireCorrection('', true)),
                dispatch(getInformationCompany()),
            ]);
        })();
    }, []);

    useEffect(() => {
        setInvoice(invoiceCorrection);
    }, [invoiceCorrection]);

    useEffect(() => {
        if (lengthGreaterThanZero(historyDocuments) && param.queryParam) {
            const document = historyDocuments.find((value: IGenericRecord) => value.id === param.queryParam);
            dispatch(getDocumentRequireCorrection(document?.id));
        }
    }, [historyDocuments, viewDocument]);

    useEffect(() => {
        fetchData();
    }, [historyDocuments]);

    const handleGenerateRejection = async (): Promise<void> => {
        await dispatch(setSelectedDocument(invoiceCorrection));
        setGenerateRejection(true);
    };

    const handleInvoiceDisplay = async (): Promise<void> => {
        setAcceptRejection(true);
    };

    const fetchData = async (): Promise<void> => {
        if (!historyDocuments.length) {
            await dispatch(getDocumentRequireCorrection('', true));
        }
    };

    const download = (type?: string): void => {
        if (type === PDF) FileSaver.saveAs(selectInvoice?.invoice_pdf_url || '', 'factura.pdf');
        else downloadXML(selectInvoice?.file_name_extension);
    };

    const handleAgreement = async (invoice: IGenericRecord): Promise<void> => {
        await dispatch(
            setAgreement({
                invoice_id: invoice.id,
                acceptance_agreement: true,
                accept: true,
                reason_rejection_id: invoice.reason_rejections[0].id,
                reason_rejection_description: 'bad',
                code_credit_note: invoice.reason_rejections[0].code_credit_note,
                code_debit_note: invoice.reason_rejections[0].code_debit_note,
                observation: invoice.reason_rejections[0].observation,
            })
        );
        await dispatch(getHistoryCorrectionDocumentsClient());
    };

    return (
        <div className="flex flex-col h-full">
            {viewCorrection || acceptRejection ? (
                <VisualizationCorrectionDocument
                    id={invoiceCorrection.id}
                    fields={fields}
                    setViewCorrection={setViewCorrection}
                    viewCorrection={viewCorrection}
                    accept={acceptRejection}
                    setAcceptRejection={setAcceptRejection}
                    invoice={invoiceCorrection}
                    reasonRejection={invoiceCorrection.reason_rejections[0].reason_rejection_name}
                    invoiceView={viewDocument}
                />
            ) : viewDocument.show ? (
                <VisualizationElectronicDocument
                    showHeader={true}
                    invoice={selectInvoice}
                    setViewDocument={setViewDocument}
                    setAcceptRejection={setAcceptRejection}
                />
            ) : generateRejection ? (
                <EditEmailTemplate
                    invoiceCorrection={selectInvoice}
                    setInvoiceCorrection={setInvoice}
                    routesComponent={routesEmailTemplate()}
                    setGenerateRejection={setGenerateRejection}
                    goBack={false}
                    sendEmailCustom
                    methodSendEmail={sendEmailTemplate}
                    route={Routes.CORRECTION_DOCUMENTS_CLIENT_EMPLOYER}
                />
            ) : (
                <div className="flex flex-col h-full">
                    <div className="flex flex-col">
                        <PageTitle
                            title="Documentos electrónicos"
                            pageContent="Facturación electrónica, Documento soporte, Notas débito y crédito, notas de ajuste"
                        />
                        <BreadCrumb routes={routes()} />
                        <h3 className="w-full font-bold text-center text-26lg font-allerbold mb-7 text-blue">
                            {MODULE_TITLES.NOTE}
                        </h3>
                        <h4 className="mb-2 text-lg font-bold text-gray-dark font-allerbold">
                            Corrección de documentos electrónicos ante el cliente por parte del empresario
                        </h4>
                        <p className="mb-4.5 text-gray-dark">
                            A continuación, conozca a detalle el estado de su documento y haga click en la acción que necesite
                        </p>
                    </div>
                    <div className="flex flex-wrap">
                        <div className="download__type">
                            <Icon name="newPdf" className="px-2" />

                            <p className="download__type--text" onClick={(): void => download(PDF)}>
                                Descargar PDF
                            </p>
                        </div>

                        <div className="download__type">
                            <Icon name="xml" className="px-2" />
                            <p className="download__type--text" onClick={(): void => download()}>
                                Descargar XML
                            </p>
                        </div>
                    </div>
                    <div className="mt-4.5">
                        <p className="text-base font-bold font-allerbold text-blue">
                            Número de documento: <span className="text-purple">{selectInvoice?.number}</span>
                        </p>
                        <p className="text-base font-bold font-allerbold text-blue">
                            Prefijo: <span className="text-purple">{selectInvoice?.prefix}</span>
                        </p>
                        <VisualizationElectronicDocument
                            invoice={selectInvoice}
                            handleInvoiceDisplay={handleInvoiceDisplay}
                            handleGenerateRejection={handleGenerateRejection}
                            reasonRejections={reasonRejections}
                            handleAgreement={handleAgreement}
                        />

                        <PageButtonsFooter
                            {...buttonsFooterProps(
                                ModuleApp.ELECTRONIC_DOCUMENTS,
                                history,
                                getRoute(Routes.REPORT_ELECTRONIC_DOCUMENTS),
                                {
                                    name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                                    moduleName: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                                }
                            )}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CorrectionDocumentsClientEmployer;
