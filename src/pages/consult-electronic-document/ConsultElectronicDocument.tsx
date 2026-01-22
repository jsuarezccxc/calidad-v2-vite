import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

import { RootState } from '@redux/rootReducer';
import { getSpecificDocument } from '@redux/cancellation-electronic-document/actions';
import { getQuoteById } from '@redux/quotes/actions';
import { buttonsFooterProps } from '@utils/Button';
import { getRouteName } from '@utils/Paths';
import { ModuleApp, ElementType, ActionElementType, generateId } from '@utils/GenerateId';
import { ID, TYPE } from '@constants/UtilsConstants';
import { Routes } from '@constants/Paths';
import { SUPPORT_DOCUMENTS_SUBTITLE } from '@constants/DocumentTexts';
import { PURCHASE_SUPPLIER } from '@constants/ElectronicInvoice';
import { BreadCrumb } from '@components/bread-crumb';
import { PageTitle } from '@components/page-title';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { SUPPORT_DOCUMENTS_TITLE } from '@constants/ElectronicDocuments';
import { CONSULT_ELECTRONIC_DOCUMENT } from '@information-texts/ConsultElectronicDocument';
import { Icon } from '@components/icon';
import { Modal } from '@components/modal';
import { Actions, Download } from './components';
import { backPage, nextPage, principalTitle, routes, TYPE_NAVIGATION } from '.';

import './ConsultElectronicDocument.scss';

const ConsultElectronicDocument: React.FC = () => {
    const dispatch = useDispatch();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get(ID);
    const typeNavigation = queryParams.get(TYPE);
    const history = useHistory();
    const [showModal, setShowModal] = useState(false);

    const isQuoteView = typeNavigation === TYPE_NAVIGATION.QUOTE_VIEW;

    const { document: electronicDocument } = useSelector(({ cancellationElectronicDocuments }: RootState) => cancellationElectronicDocuments);
    const { quoteData } = useSelector(({ quotes }: RootState) => quotes);

    const document = isQuoteView ? quoteData : electronicDocument;
    const invoiceType = document?.invoice_type;

    useEffect(() => {
        if (id) {
            if (isQuoteView) {
                dispatch(getQuoteById(id));
            } else {
                dispatch(getSpecificDocument(id));
            }
        }
    }, [id, isQuoteView]);

    return (
        <main className="consult-electronic-document">
            <PageTitle pageContent={SUPPORT_DOCUMENTS_SUBTITLE} title={SUPPORT_DOCUMENTS_TITLE} />
            <BreadCrumb routes={routes(invoiceType, isQuoteView)} />
            <h3 className="w-full font-bold text-center font-allerbold text-26lg text-blue mb-7">
                {principalTitle(invoiceType, isQuoteView)}
            </h3>
            {!isQuoteView && (
                <>
                    <p className="mb-2 text-lg font-bold font-allerbold text-blue">{CONSULT_ELECTRONIC_DOCUMENT.STATE_DOCUMENT}</p>
                    <p className="text-gray-dark mb-4.5">{CONSULT_ELECTRONIC_DOCUMENT.STATE_PURCHASE}</p>
                </>
            )}
            {isQuoteView && (
                <>
                    <p className="mb-2 text-lg font-bold font-allerbold text-blue">Visualización cotización</p>
                    <p className="text-gray-dark mb-4.5">
                        A continuación, revise en detalle la cotización y seleccione la acción que desea realizar.
                    </p>
                </>
            )}
            <Download
                isPurchaseSupplier={invoiceType === PURCHASE_SUPPLIER}
                electronicDocument={document}
                isQuote={isQuoteView}
            />
            {isQuoteView && document && (document.invoice_pdf_url || document.pdf_url) && (
                <div className="flex justify-center mb-8">
                    <div className="relative" style={{ width: '471px', height: '504px' }}>
                        <div className="absolute inset-0 bg-green-extraLight rounded-md shadow-lg" />
                        <div className="relative p-6 flex items-center justify-center overflow-hidden" style={{ height: '504px' }}>
                            <div className="relative">
                                <div className="pointer-events-none">
                                    <Document
                                        file={document.invoice_pdf_url || document.pdf_url}
                                    >
                                        <Page
                                            pageNumber={1}
                                            width={380}
                                            height={400}
                                            className="rounded"
                                        />
                                    </Document>
                                </div>
                                <div
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow z-10 pointer-events-auto"
                                    onClick={(): void => setShowModal(true)}
                                >
                                    <Icon name="searchPlusBlue" className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                        <Modal
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.MODALS}-preview-quote-pdf`,
                                action: ActionElementType.ACTION,
                                elementType: ElementType.BTN,
                            })}
                            handleClose={(): void => setShowModal(false)}
                            open={showModal}
                        >
                            <Document file={document.invoice_pdf_url || document.pdf_url} className="relative">
                                <Icon
                                    name="closeHeader"
                                    onClick={(): void => setShowModal(false)}
                                    className="absolute cursor-pointer -right-7 -top-7"
                                />
                                <Page pageNumber={1} />
                            </Document>
                        </Modal>
                    </div>
                </div>
            )}
            {!isQuoteView && <Actions />}
            <div className="flex items-end justify-end my-0 text-right xs:flex xs:items-center xs:justify-center">
                <PageButtonsFooter
                    {...buttonsFooterProps(
                        ModuleApp.ELECTRONIC_DOCUMENTS,
                        history,
                        nextPage(typeNavigation, id),
                        {
                            name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                            moduleName: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                        },
                        undefined,
                        backPage(typeNavigation)
                    )}
                />
            </div>
        </main>
    );
};

export default ConsultElectronicDocument;
