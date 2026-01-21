import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionType, TypeNote } from '@models/CorrectCancelElectronicDocument';
import { includeArray } from '@utils/Array';
import { currentDateInUnix } from '@utils/Date';
import { lengthGreaterThanZero } from '@utils/Length';
import { filterOptionReasonRejections } from '@utils/ElectronicInvoice';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import { RootState } from '@redux/rootReducer';
import { getDocumentList, getInvoicesAvailable } from '@redux/electronic-invoice/actions';
import { getFilesCompanyAction } from '@redux/parameterization-customization-electronic-invoice/actions';
import { getSpecificDocument } from '@redux/cancellation-electronic-document/actions';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { ADJUSTMENT_NOTE } from '@constants/ElectronicInvoice';
import { NotesContext } from '@pages/correct-cancel-electronic-document/context';
import { PAGE_INFORMATION } from '@information-texts/CorrectCancelElectronicDocument';
import { Form } from '@components/form';
import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import { Information, InformationElectronicDocument } from '@components/information';
import { IOptionSelect, SelectSearchInput } from '@components/input';
import useParam from '@hooks/useParam';
import usePermissions from '@hooks/usePermissions';
import { routes, TypeLogoElectronicDocument, UTILS, DATE_TO_LIST } from '.';

export const NoteForm: React.FC = () => {
    const [dispatchRedux, { SET_MAIN_FORM }, { queryParam: noteId }] = [useDispatch(), ActionType, useParam('ID')];
    const {
        state: { typeNote, mainForm },
        validations: { validationMainForm },
        dispatch,
        ...moreState
    } = useContext(NotesContext);
    const { quantityInvoices = {}, utilsData, draftDocument } = useSelector(
        ({ electronicInvoice, correctionBusinessDocument, cancellationElectronicDocuments }: RootState) => ({
            draftDocument: cancellationElectronicDocuments.document,
            quantityInvoices: electronicInvoice.quantityInvoices,
            utilsData: correctionBusinessDocument.utilsData,
        })
    );
    const { disabledInputs } = usePermissions();

    const handleTypeNote = ({ key, value }: IOptionSelect): void => {
        dispatch({ type: SET_MAIN_FORM, mainForm: { typeNote: value, associatedDocument: '', reason: '', idReason: '' } });
        dispatch({ type: ActionType.SET_TYPE_NOTE, typeNote: key as TypeNote });
        moreState.resetNote();
    };

    const handleAssociatedDocument = (idInvoice: string): void => {
        dispatch({ type: SET_MAIN_FORM, mainForm: { ...mainForm, associatedDocument: idInvoice } });
        dispatchRedux(getSpecificDocument(idInvoice));
        dispatchRedux(
            getFilesCompanyAction(
                typeNote === ADJUSTMENT_NOTE ? TypeLogoElectronicDocument.LOGO_SUPPORT : TypeLogoElectronicDocument.LOGO_INVOICE
            )
        );
        moreState.resetNote();
    };

    const handleReason = ({ value, id = '' }: IOptionSelect): void => {
        dispatch({ type: SET_MAIN_FORM, mainForm: { ...mainForm, reason: value, idReason: id } });
    };

    const handleDraftDocument = (): void => {
        const { rejected_invoices } = draftDocument;
        const [reasonRejection] = lengthGreaterThanZero(rejected_invoices)
            ? rejected_invoices
            : [{ reason_rejection_id: '', reason_rejection_description: '' }];
        dispatch({
            type: SET_MAIN_FORM,
            mainForm: {
                ...mainForm,
                associatedDocument: draftDocument.invoice_id,
                reason: reasonRejection.reason_rejection_description,
                idReason: reasonRejection.reason_rejection_id,
            },
        });
    };

    useEffect(() => {
        dispatchRedux(getInvoicesAvailable());
        dispatchRedux(getDocumentList({ ...DATE_TO_LIST, finish_date: currentDateInUnix() }, true));
    }, []);

    useEffect(() => {
        if (noteId) dispatchRedux(getSpecificDocument(noteId));
    }, [noteId]);

    useEffect(() => {
        if (noteId && Object.keys(draftDocument || {}).length && UTILS.TYPE_NOTES.includes(draftDocument.invoice_type))
            handleDraftDocument();
    }, [noteId, draftDocument]);

    const optionsTypeNoteRender = moreState.optionsTypeNote.map(item => ({ ...item, name: item.value }));
    const optionReasonRejectionsRender = filterOptionReasonRejections(utilsData?.reason_rejections, typeNote).map(item => ({
        ...item,
        name: item.value,
    }));

    return (
        <>
            <PageTitle {...UTILS.PAGE_TITLE} classContainer="lg:mb-0" classTitle="leading-19.38px" />
            <BreadCrumb routes={routes(PAGE_INFORMATION[typeNote].TITLE)} />
            <Information
                title={MODULE_TITLES.NOTE}
                classNameTitle="font-allerbold text-26lg leading-8"
                classNameSubContainer="justify-center mb-4.5"
                color="blue"
            />
            <InformationElectronicDocument
                title={PAGE_INFORMATION[typeNote].TITLE}
                question={PAGE_INFORMATION[typeNote].QUESTION}
                lightBulb={PAGE_INFORMATION[typeNote].LIGHT_BULB}
                description={PAGE_INFORMATION.DESCRIPTION}
                quantityInvoices={quantityInvoices}
            />
            <Form sendWithEnter className="w-151.50 xs:w-full flex flex-wrap gap-x-7 gap-y-4.5">
                <SelectSearchInput
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                        submodule: `form-type-note`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.DRP,
                    })}
                    selectIconType="arrowDownGreen"
                    classesWrapper="w-73 xs:w-full"
                    onChangeSelect={(_, e): void => handleTypeNote(e)}
                    valueSelect={mainForm.typeNote}
                    optionSelect={optionsTypeNoteRender}
                    placeholder="Seleccionar"
                    labelText="Tipo de nota:"
                    disabled={disabledInputs}
                />
                <SelectSearchInput
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                        submodule: `form-associated-document`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.DRP,
                    })}
                    valueSelect={mainForm.associatedDocument}
                    onChangeSelect={handleAssociatedDocument}
                    labelText="*Documento asociado:"
                    selectIconType="arrowDownGreen"
                    classesWrapper="w-73 xs:w-full"
                    optionSelect={moreState.optionsDocuments}
                    placeholder="Seleccionar"
                    required={includeArray(validationMainForm, 'associatedDocument')}
                    disabled={disabledInputs}
                />
                <SelectSearchInput
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                        submodule: `form-reason`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.DRP,
                    })}
                    optionSelect={optionReasonRejectionsRender}
                    descTooltip={PAGE_INFORMATION[typeNote].REASON}
                    selectIconType="arrowDownGreen"
                    classesWrapper="w-73 xs:w-full"
                    onChangeSelect={(_, e): void => handleReason(e)}
                    valueSelect={mainForm.reason}
                    placeholder="Seleccionar"
                    titleTooltip="Motivo:"
                    labelText="*Motivo:"
                    required={includeArray(validationMainForm, 'reason')}
                    tooltipInfo
                    disabled={disabledInputs}
                />
            </Form>
        </>
    );
};
