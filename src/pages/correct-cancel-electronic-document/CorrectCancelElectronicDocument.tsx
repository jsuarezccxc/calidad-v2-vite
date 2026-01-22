import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { INFO_DATE, MODAL_TYPE, TOOLTIP_PAGE } from '@information-texts/CorrectCancelElectronicDocument';
import { IGenericRecord } from '@models/GenericRecord';
import {
    ActionType,
    IElectronicDocument,
    IValidateInFunction,
    IValidateNote,
    IValidations,
    TypeNote,
} from '@models/CorrectCancelElectronicDocument';
import { getRoute } from '@utils/Paths';
import { isCorrectResponse } from '@utils/Response';
import { lengthGreaterThanZero } from '@utils/Length';
import { changeUltimateItem, discardUntaxed, valueToRate } from '@utils/ElectronicInvoice';
import { buildOptions, buildOptionsSearch } from '@utils/Company';
import { setOptionsSelect, validateDocument } from '@utils/ElectronicNote';
import { getDateAnyFormat, getTodaysTime, getDateISO8601ToDate, currentDateInUnix } from '@utils/Date';
import { ModuleApp } from '@utils/GenerateId';
import { Routes } from '@constants/Paths';
import { TitleButtons } from '@constants/Buttons';
import { ACCEPTED } from '@constants/InvoiceState';
import { INIT_STATE, INIT_VALIDATE, MODALS, PageModals } from '@constants/CorrectCancelElectronicDocument';
import {
    ADJUSTMENT_NOTE,
    DEFAULT_LANG,
    DOCUMENT_TYPE_REQUIRE,
    NA,
    TypeFile,
    ValidateClassName,
} from '@constants/ElectronicInvoice';
import useModal from '@hooks/useModal';
import usePermissions from '@hooks/usePermissions';
import useScrollToError from '@hooks/useScrollToError';
import useInvoiceHeader from '@hooks/useInvoiceHeader';
import { RootState } from '@redux/rootReducer';
import { getSuppliers } from '@redux/suppliers/actions';
import { getInformationCompany } from '@redux/company/actions';
import { getUtilsData } from '@redux/correction-business-document/actions';
import { postAdjustmentNoteData } from '@redux/create-adjustment-note/actions';
import { postCreateNote, setSpecificDocument } from '@redux/cancellation-electronic-document/actions';
import { getFilesCompanyAction, postFileCompanyAction } from '@redux/parameterization-customization-electronic-invoice/actions';
import {
    getDocumentList,
    getInvoicesAvailable,
    getPrefixCompany,
    getUniqueProductStock,
} from '@redux/electronic-invoice/actions';
import { ModalType } from '@components/modal';
import InvoiceHeader from '@components/Invoice-header';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { TYPE_NAVIGATION } from '@pages/consult-electronic-document';
import { CreateAdjustmentNote, CreditDebitNote, NoteForm, DATE_TO_LIST } from './components';
import { NotesContext } from './context';
import { NotesReducer } from './reducer/action';
import { UTILS } from '.';

const CorrectCancelElectronicDocument: React.FC = () => {
    const [{ pathname }, history, dispatchRedux, { NOTE_TYPE_OPTIONS, validateMainForm, KEYS_VALIDATE_NOTE }] = [
        useLocation(),
        useHistory(),
        useDispatch(),
        UTILS,
    ];
    const {
        electronicInvoice: {
            responseList: { data: associatedDocument },
            products,
            storePrefix,
        },
        cancellationElectronicDocuments: { document: electronicDocument },
        utilsData,
    } = useSelector(({ electronicInvoice, cancellationElectronicDocuments, correctionBusinessDocument }: RootState) => ({
        electronicInvoice,
        cancellationElectronicDocuments,
        utilsData: correctionBusinessDocument.utilsData,
    }));
    const { disabledInputs } = usePermissions();
    const [{ mainForm, typeNote, note, submit }, dispatch] = useReducer(NotesReducer, INIT_STATE);
    const isAdjustmentNote = typeNote === ADJUSTMENT_NOTE;
    const typeLogo = isAdjustmentNote ? TypeFile.LOGO_SUPPORT : TypeFile.LOGO_INVOICE;
    const { leftColumn, centerColumn, cardFile, propsInput, setLang } = useInvoiceHeader();
    const [idNote, setIdNote] = useState<string>('');
    const { toggleModal, activeModal } = useModal({ ...MODALS });
    const { scrollToInput } = useScrollToError();
    const validations = useMemo<IValidations>(
        () => ({
            validationMainForm: submit ? validateMainForm(mainForm) : [],
            validateNote: submit ? (validateDocument(note, KEYS_VALIDATE_NOTE) as IValidateNote) : { ...INIT_VALIDATE },
        }),
        [submit, mainForm, note]
    );

    const optionsDocuments = useMemo(
        () =>
            UTILS.buildOptionsSearch(
                (associatedDocument as IElectronicDocument[]).filter(({ invoice_type }) =>
                    isAdjustmentNote
                        ? invoice_type === DOCUMENT_TYPE_REQUIRE.SUPPORT_DOCUMENT
                        : invoice_type === DOCUMENT_TYPE_REQUIRE.INVOICE
                )
            ),
        [associatedDocument, isAdjustmentNote]
    );

    const optionsForm = useMemo(
        () => ({
            fiscalResponsibilities: buildOptions(changeUltimateItem(utilsData?.fiscal_responsibilities)),
            paymentMethods: buildOptions(changeUltimateItem(utilsData?.payment_methods)),
            taxDetails: buildOptions(changeUltimateItem(utilsData?.tax_details)),
            foreignExchange: buildOptionsSearch(utilsData?.foreign_exchange),
            prefix: setOptionsSelect(storePrefix, 'prefix', true, false),
            documentTypes: buildOptions(utilsData?.document_types),
            typeTaxPayer: buildOptions(utilsData?.type_tax_payer),
            paymentTypes: buildOptions(utilsData?.payment_types),
            withholdings: buildOptions(utilsData?.withholdings),
        }),
        [utilsData, storePrefix]
    );

    const resetNote = (): void => {
        dispatchRedux(setSpecificDocument({}));
        dispatchRedux(getUniqueProductStock());
    };

    const requestData = (): IGenericRecord => {
        const idReason = mainForm.idReason;
        const foreignRate = note.foreign_exchange_rate;
        const date = getTodaysTime('YYYY-MM-DD');
        return {
            ...note,
            ...UTILS.codeReasonRejection(utilsData.reason_rejections, idReason, typeNote),
            date,
            date_limit: date,
            lang: propsInput.valueSelect,
            products: note.products.map(({ date_expiration, ...product }) => {
                const productFind = products.find(item => item.sku_internal === product.sku_internal) || {};
                const taxes = discardUntaxed(productFind.unique_product_taxes);

                return {
                    ...product,
                    product_taxes: taxes.map(valueToRate(foreignRate)),
                    date_expiration: date_expiration === NA ? null : getDateISO8601ToDate(date_expiration || ''),
                    taxes: taxes.map(({ company_tax_id, tax_value }) => valueToRate(foreignRate)({ company_tax_id, tax_value })),
                };
            }),
            invoice_state: ACCEPTED,
            invoice_type: typeNote,
            number: 0,
            reason_rejection_id: idReason,
            reason_rejection_description: mainForm.reason,
            time_issue: getTodaysTime(),
            name_legal_representative: note.name_legal_representative,
            fiscal_responsibilities: note.fiscal_responsibilities.map(({ id }) => ({ id: String(id) })),
        };
    };

    const validate = (): boolean => {
        dispatch({ type: ActionType.SET_SUBMIT, submit: true });
        const { form, details, retentions } = validateDocument(note, KEYS_VALIDATE_NOTE, true) as IValidateInFunction;
        const noteForm = lengthGreaterThanZero(validateMainForm(mainForm));
        if (form || noteForm) {
            scrollToInput();
            return true;
        }
        if (!form && !noteForm && details) {
            scrollToInput(ValidateClassName.ElectronicDocument);
            return details;
        }
        if (isAdjustmentNote) return note.total > electronicDocument.total;
        return retentions;
    };

    const handleSave = async (isDraft = false): Promise<void> => {
        if (validate()) return;
        const file = cardFile.file;
        if (file?.type) await dispatchRedux(postFileCompanyAction(file as Blob, typeLogo));
        const noteRequest = { ...requestData(), is_draft: isDraft };
        const { statusCode, data }: IGenericRecord = await dispatchRedux(
            isAdjustmentNote ? postAdjustmentNoteData(noteRequest) : postCreateNote(noteRequest)
        );
        if (isCorrectResponse(statusCode) || isDraft) {
            toggleModal(isDraft ? PageModals.DRAFT : PageModals.SAVE);
            const noteId: string | null = Array.isArray(data) ? data[UTILS.GET_CURRENT_NOTE]?.id : data?.id;
            setIdNote(noteId || '');
            dispatch({
                type: ActionType.SET_MAIN_FORM,
                mainForm: { ...mainForm, idReason: '', reason: '', associatedDocument: '' },
            });
            handleReset();
        }
    };

    const handleModal = (): void => toggleModal('');

    const handleRedirect = (type: string): void => {
        let param = TYPE_NAVIGATION.CREATED_DEBIT_NOTE;
        if (type === DOCUMENT_TYPE_REQUIRE.CREDIT_NOTE) param = TYPE_NAVIGATION.CREATED_CREDIT_NOTE;
        if (type === DOCUMENT_TYPE_REQUIRE.ADJUSTMENT_NOTE) param = TYPE_NAVIGATION.CREATED_ADJUSTMENT_NOTE;
        history.push(`${getRoute(Routes.CONSULT_ELECTRONIC_DOCUMENT)}?id=${idNote}${param ? `&type=${param}` : ''}`);
    };

    const handleReset = (): void => {
        dispatch({ type: ActionType.SET_NOTE, note: { ...INIT_STATE.note } });
        dispatch({ type: ActionType.SET_SUBMIT, submit: false });
        dispatchRedux(getFilesCompanyAction(isAdjustmentNote ? TypeFile.LOGO_SUPPORT : TypeFile.LOGO_INVOICE));
        dispatchRedux(getDocumentList({ ...DATE_TO_LIST, finish_date: currentDateInUnix() }, true));
    };

    useEffect(() => {
        (async (): Promise<void> => {
            await Promise.all([
                dispatchRedux(getUniqueProductStock()),
                dispatchRedux(getInvoicesAvailable()),
                dispatchRedux(getUtilsData()),
                dispatchRedux(getInformationCompany()),
                dispatchRedux(getSuppliers(true)),
            ]);
        })();
        return (): void => {
            resetNote();
        };
    }, []);

    useEffect(() => {
        const [, , typeNote] = String(pathname).split('/');
        dispatch({
            type: ActionType.SET_TYPE_NOTE,
            typeNote: typeNote as TypeNote,
        });
        dispatch({
            type: ActionType.SET_MAIN_FORM,
            mainForm: { ...mainForm, typeNote: NOTE_TYPE_OPTIONS.find(({ key }) => key === typeNote)?.value || '' },
        });
    }, [pathname]);

    useEffect(() => {
        if (!UTILS.validateSameNoteType(typeNote, mainForm.typeNote)) return;
        (async (): Promise<void> => {
            await dispatchRedux(getPrefixCompany({ with_prefixes: true, types: [typeNote] }));
        })();
        handleReset();
    }, [typeNote, mainForm]);

    useEffect(() => {
        setLang(electronicDocument?.lang || DEFAULT_LANG);
    }, [electronicDocument]);

    return (
        <NotesContext.Provider
            value={{
                dispatch,
                products,
                resetNote,
                validations,
                optionsForm,
                optionsDocuments,
                electronicDocument,
                optionsTypeNote: NOTE_TYPE_OPTIONS,
                state: { submit, mainForm, typeNote, note },
            }}
        >
            <>
                {activeModal && (
                    <ModalType
                        moduleId={`${ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE}-generate`}
                        open
                        iconName="check"
                        handleClosed={handleModal}
                        finalAction={(): void => {
                            if (activeModal === PageModals.SAVE) handleRedirect(DOCUMENT_TYPE_REQUIRE[typeNote]);
                            handleModal();
                        }}
                        {...(activeModal === PageModals.SAVE
                            ? {
                                  textButton: TitleButtons.NEXT,
                                  text: MODAL_TYPE.SAVE(DOCUMENT_TYPE_REQUIRE[typeNote].toLowerCase()),
                                  otherButton: {
                                      textButton: `Generar nueva ${DOCUMENT_TYPE_REQUIRE[typeNote].toLowerCase()}`,
                                      onClick: handleModal,
                                  },
                              }
                            : { text: MODAL_TYPE.DRAFT, textButton: isAdjustmentNote ? TitleButtons.NEXT : TitleButtons.ACCEPT })}
                    />
                )}
                <NoteForm />
                {mainForm.associatedDocument && lengthGreaterThanZero(Object.keys(electronicDocument)) && (
                    <div className="mr-3.75 mb-7">
                        <InvoiceHeader
                            className="mt-7"
                            cardFile={cardFile}
                            propsInput={propsInput}
                            leftColumn={leftColumn()}
                            textBack={INFO_DATE[typeNote]}
                            dates={{
                                transmission: getDateAnyFormat(note.date),
                                hour: getTodaysTime(),
                                expiration: getDateAnyFormat(note.date_limit),
                            }}
                            centerColumn={centerColumn({ documentType: typeNote })}
                        />
                        {isAdjustmentNote ? <CreateAdjustmentNote /> : <CreditDebitNote />}
                    </div>
                )}
                <PageButtonsFooter
                    moduleId={ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE}
                    className="flex items-center justify-end mt-auto font-allerbold mr-3.75"
                    classNameBtnCenter="inline-flex items-center justify-center px-2.75 py-0.5"
                    onClickButtonLeft={(): void => history.goBack()}
                    titleButtonLeft={TitleButtons.BACK}
                    onClickButtonCenter={(): void => {
                        handleSave(true);
                    }}
                    titleButtonCenter={TitleButtons.SAVE_DRAFT}
                    onClickButtonRight={(): void => {
                        handleSave();
                    }}
                    titleButtonRight={TitleButtons.NEXT}
                    tooltip={TOOLTIP_PAGE.BUTTON_DRAFT}
                    threeButtons
                    disabledCenter={disabledInputs}
                    disabledRight={disabledInputs}
                />
            </>
        </NotesContext.Provider>
    );
};

export default CorrectCancelElectronicDocument;
