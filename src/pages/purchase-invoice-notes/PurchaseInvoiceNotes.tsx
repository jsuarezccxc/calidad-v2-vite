import React from 'react';
import useRoutes from '@hooks/useRoutes';
import { ModalType } from '@constants/Modal';
import { Modals } from '@constants/PurchaseInvoiceNotes';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { DATA_TOTAL_VALUES } from '@constants/ElectronicInvoice';
import { PURCHASE_NOTE_DESCRIPTION, PURCHASE_NOTE_SUBTITLE, TOOLTIPS_FORM } from '@information-texts/PurchaseNote';
import { TextArea } from '@components/input';
import { SharedModal } from '@components/modal';
import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import { TableTotals } from '@components/table-totals';
import { TableInvoice } from '@components/table-invoice';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { PurchaseInvoiceCards } from '@components/electronic-documents';
import { Information, InformationElectronicDocument } from '@components/information';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import { MainForm, NoteForm } from './components';
import usePurchaseInvoiceNotes from './hooks/usePurchaseInvoiceNotes';
import { UTILS } from '.';
import './PurchaseInvoiceNotes.scss';

const PurchaseInvoiceNotes: React.FC = () => {
    const { routes } = useRoutes(UTILS.ROUTES);

    const {
        propsModals: { activeModal, toggleModal, handleClose },
        propsCards,
        propsButton,
        propsForm,
        propsTable,
        propsMainForm,
        propsTotals,
        ...moreProps
    } = usePurchaseInvoiceNotes();

    const invoiceType = propsMainForm.mainForm.invoice_type;

    return (
        <>
            {activeModal && (
                <SharedModal
                    moduleId={`${ModuleApp.PURCHASE_INVOICE_NOTES}-delete`}
                    type={activeModal === Modals.Delete ? ModalType.Delete : undefined}
                    handleClosed={handleClose}
                    finalAction={toggleModal}
                    open
                />
            )}
            <PageTitle {...UTILS.PAGE_TITLE} />
            <BreadCrumb routes={UTILS.breadCrumbs({ routes, type: invoiceType, id: moreProps.id })} />
            <Information
                classNameSubContainer="justify-center"
                title={MODULE_TITLES.PURCHASE_NOTE}
                classNameTitle="mb-4.5 text-26lg"
                color="blue"
            />
            <InformationElectronicDocument {...PURCHASE_NOTE_DESCRIPTION[invoiceType]} />
            <main className="purchase-invoice-notes">
                <MainForm {...propsMainForm} />
                <PurchaseInvoiceCards {...propsCards} />
                <section className="purchase-invoice-notes__note-form-card">
                    <h3 className="purchase-invoice-notes__title-form">{PURCHASE_NOTE_SUBTITLE[invoiceType]}</h3>
                    <NoteForm {...propsForm} />
                    <TableInvoice {...propsTable} />
                    <section className="totals-section">
                        <fieldset className="totals-section__group-textarea">
                            <TextArea
                                id={generateId({
                                    module: ModuleApp.PURCHASE_INVOICE_NOTES,
                                    submodule: `form-observations`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                value={propsForm.formPurchaseNote.note}
                                classesInput="input-textarea--height"
                                classesWrapper="input-textarea"
                                onChange={propsForm.handleText}
                                labelText="Observaciones:"
                                name="note"
                            />
                            <TextArea
                                id={generateId({
                                    module: ModuleApp.PURCHASE_INVOICE_NOTES,
                                    submodule: `form-internal-notes`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                value={propsForm.formPurchaseNote.internal_notes}
                                labelText="Comentario para uso interno:"
                                classesInput="input-textarea--height"
                                {...TOOLTIPS_FORM.COMMENT_INTERNAL}
                                onChange={propsForm.handleText}
                                classesWrapper="input-textarea"
                                name="internal_notes"
                            />
                        </fieldset>
                        <TableTotals {...propsTotals} totalValues={DATA_TOTAL_VALUES} isSupportOrAdjustment />
                    </section>
                </section>
            </main>
            <PageButtonsFooter {...propsButton} />
        </>
    );
};

export default PurchaseInvoiceNotes;
