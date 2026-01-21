import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Document as PdfDocument, Page } from 'react-pdf';
import { RootState } from '@redux/rootReducer';
import { CREDIT_NOTE_SUPPLIER, DEBIT_NOTE_SUPPLIER } from '@constants/PurchaseInvoiceNotes';
import { CUSTOMER_RESPONSE, DIAN_RESPONSE, PURCHASE_SUPPLIER } from '@constants/ElectronicInvoice';
import { INFORMATION_PAGE } from '@information-texts/ConsultElectronicDocument';
import { Icon } from '@components/icon';
import { Modal } from '@components/modal';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { Document, getEnum, Invoice } from '.';

export const Actions: React.FC = () => {
    const { document } = useSelector(({ cancellationElectronicDocuments }: RootState) => cancellationElectronicDocuments);
    const [showModal, setShowModal] = useState(false);

    const isPurchaseNote = [CREDIT_NOTE_SUPPLIER, DEBIT_NOTE_SUPPLIER].includes(document?.invoice_type);

    const validateConsecutive = (): Record<string, string> => {
        if (isPurchaseNote) {
            const documentNumber = document?.number || '';
            return {
                number: documentNumber.match(/\d+/g)?.join('') || '',
                name: documentNumber.match(/[A-Za-z]+/g)?.join('') || '',
            };
        }
        return {
            name: document?.consecutive?.name || document?.prefix_name_associated,
            number: document?.consecutive?.number || document?.prefix_number_associated,
        };
    };

    return (
        <div className="actions">
            <div className="flex justify-between mb-4.5 xs:flex-col">
                <div>
                    <p className="text-base font-bold font-allerbold text-blue">
                        Número del documento:
                        <span className="font-normal font-aller text-purple">&nbsp; {validateConsecutive().number}</span>
                    </p>
                    <p className="mb-6 text-base font-bold font-allerbold text-blue">
                        Prefijo:
                        <span className="font-normal font-aller text-purple">&nbsp; {validateConsecutive().name}</span>
                    </p>
                    {!isPurchaseNote && (
                        <p className="font-bold text-blue font-allerbold mb-5.5 w-88 xs:w-full">
                            {document?.invoice_type === PURCHASE_SUPPLIER
                                ? 'Estado de la transmisión y envío a cliente'
                                : getEnum(DIAN_RESPONSE, document?.answer_dian) === DIAN_RESPONSE.REJECTED_DIAN ||
                                  getEnum(CUSTOMER_RESPONSE, document?.answer_client) === CUSTOMER_RESPONSE.REJECTED_CLIENT
                                ? 'Aceptación o rechazo del documento electrónico por parte de la DIAN y/o su cliente'
                                : 'Estado de la transmisión y envío a cliente'}
                        </p>
                    )}
                    {document?.invoice_type === PURCHASE_SUPPLIER || isPurchaseNote ? <Invoice /> : <Document />}
                </div>
                <div className="actions__preview">
                    <PdfDocument file={document?.invoice_pdf_url} className="w-full h-full">
                        <Page pageNumber={1} className="w-full h-full" />
                    </PdfDocument>
                    <div className="actions__preview--pdf" onClick={(): void => setShowModal(true)}>
                        <Icon name="searchPlusBlue" className="hidden cursor-pointer" />
                    </div>
                    <Modal
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `${ModuleApp.MODALS}-preview-pdf`,
                            action: ActionElementType.ACTION,
                            elementType: ElementType.BTN,
                        })}
                        handleClose={(): void => setShowModal(false)}
                        open={showModal}
                    >
                        <PdfDocument file={document?.invoice_pdf_url} className="relative">
                            <Icon
                                name="closeHeader"
                                onClick={(): void => setShowModal(false)}
                                className="absolute cursor-pointer -right-7 -top-7"
                            />
                            <Page pageNumber={1} />
                        </PdfDocument>
                    </Modal>
                </div>
            </div>
            {document?.dian_url && (
                <>
                    <p className="mb-2 text-blue">{INFORMATION_PAGE.LINK[document?.invoice_type]}</p>
                    <a href={document?.dian_url} target="__blank" className="underline text-purple">
                        {document?.cufe}
                    </a>
                </>
            )}
        </div>
    );
};
