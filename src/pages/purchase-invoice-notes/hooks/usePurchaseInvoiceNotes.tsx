import { useHistory } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NumberFormatValues } from 'react-number-format';
import {
    IFormPurchaseInvoiceNote,
    IMainFormNote,
    IPurchaseInvoiceNoteRequest,
    IStateCards,
    ResponsePurchaseNote,
} from '@models/PurchaseInvoiceNotes';
import { IUtilReasonRequest } from '@models/Utils';
import { ISupplier } from '@models/PurchaseInvoice';
import { IInvoiceDetails } from '@models/ElectronicInvoice';
import { IValidateInFunction, IValidateNote } from '@models/CorrectCancelElectronicDocument';
import {
    DEFAULT_MAIN_FORM,
    FORM_PURCHASE_INVOICE_NOTE,
    FORM_MAIN_PURCHASE_INVOICE_NOTE,
    NotesPurchaseType,
    PURCHASE_INVOICE_NOTE_TEMPLATE,
    SUPPLIER_TEMPLATE,
    NameInputs,
    Modals,
    STATE_MODALS,
} from '@constants/PurchaseInvoiceNotes';
import { Routes } from '@constants/Paths';
import { INVOICE_LOGO } from '@constants/Invoice';
import { ParamsToPage } from '@constants/UrlParams';
import { FORMAT_YYYY_MM_DD } from '@constants/Date';
import { FOREIGN_EXCHANGE, REASON_REJECTIONS } from '@constants/DynamicRequest';
import { INIT_VALIDATE } from '@constants/CorrectCancelElectronicDocument';
import { DATA_TABLE_TOTALS, DATA_WITHHOLDINGS, NA, ValidateClassName } from '@constants/ElectronicInvoice';
import useParam from '@hooks/useParam';
import useModal from '@hooks/useModal';
import useScrollToError from '@hooks/useScrollToError';
import useInvoiceDetails from '@hooks/useInvoiceDetails';
import { useSymbolCurrency } from '@hooks/useSymbolCurrency';
import { RootState } from '@redux/rootReducer';
import { getUtils } from '@redux/utils/actions';
import { getInformationCompany } from '@redux/company/actions';
import { getInvoicePurchase, postPurchaseNote } from '@redux/report-note-purchase/actions';
import { getDocumentList, getInvoiceCalculations, getUniqueProductStock } from '@redux/electronic-invoice/actions';
import { getFilesCompanyAction, postFileCompanyAction } from '@redux/parameterization-customization-electronic-invoice/actions';
import { getRoute } from '@utils/Paths';
import { AssignDataToObject } from '@utils/Json';
import { buttonsFooterProps } from '@utils/Button';
import { calculatePercentage } from '@utils/Number';
import { isCorrectResponse } from '@utils/Response';
import { lengthGreaterThanZero } from '@utils/Length';
import { updateTableTotals } from '@utils/ElectronicInvoice';
import { currentDateInUnix, getDateAnyFormat, getDateFromUnix, getDateISO8601ToDate, getUnixFromDate } from '@utils/Date';
import { validateDocument, tableTotalsToJson } from '@utils/ElectronicNote';
import { ModuleApp } from '@utils/GenerateId';
import { ChangeEvent } from '@components/input';
import { IOption } from '@components/select-search';
import { ITableTotalsProps } from '@components/table-totals';
import { ITableInvoiceProps } from '@components/table-invoice';
import { ICardsProps } from '@components/electronic-documents/cards/';
import { IPageButtonsFooterProps } from '@components/page-buttons-footer';
import { IMainFormProps, INoteFormProps, DATE_TO_LIST, REQUIRED_TEXT } from '../components';

/**
 * This interface is props to modals
 *
 * @typeParam activeModal: string - Active modal
 * @typeParam toggleModal: () => void - Toggle modal
 * @typeParam handleClose: () => void - Handle state modal
 */
interface IModalProps {
    activeModal: string;
    toggleModal: () => void;
    handleClose: () => void;
}

/**
 * This interface is hooks page
 *
 * @typeParam id: string - ID of purchase invoice
 * @typeParam propsCards: ICardsProps - Props cards
 * @typeParam propsModals: IModalProps - Props modals
 * @typeParam propsForm: INoteFormProps - Props form
 * @typeParam propsMainForm: IMainFormProps - Props main form
 * @typeParam propsTable: ITableInvoiceProps - Props table
 * @typeParam propsTotals: Pick<ITableTotalsProps, 'dataTotals' | 'symbol'> - Props totals
 * @typeParam propsButton: IPageButtonsFooterProps - Props buttons
 */
interface IUsePurchaseInvoiceNotes {
    id: string;
    propsCards: ICardsProps;
    propsModals: IModalProps;
    propsForm: INoteFormProps;
    propsMainForm: IMainFormProps;
    propsTable: ITableInvoiceProps;
    propsTotals: Pick<ITableTotalsProps, 'dataTotals' | 'symbol'>;
    propsButton: IPageButtonsFooterProps;
}

/**
 * This is hook custom to page
 *
 * @returns IUsePurchaseInvoiceNotes
 */
const usePurchaseInvoiceNotes = (): IUsePurchaseInvoiceNotes => {
    const [{ queryParam: id }, { queryParam: type }, dispatch, history] = [
        useParam(ParamsToPage.ID),
        useParam(ParamsToPage.Type),
        useDispatch(),
        useHistory(),
    ];

    const { purchaseInvoice, productsStock, companyData, utils, invoiceCalculations } = useSelector(
        ({ reportNotesPurchase, electronicInvoice, company, utils }: RootState) => ({
            invoiceCalculations: electronicInvoice.invoiceCalculations,
            purchaseInvoice: reportNotesPurchase.invoice,
            productsStock: electronicInvoice.products,
            companyData: company.information,
            utils: utils.utils,
        })
    );

    const [formPurchaseNote, setFormPurchaseNote] = useState<IFormPurchaseInvoiceNote>({ ...FORM_PURCHASE_INVOICE_NOTE });
    const [mainForm, setMainForm] = useState<IMainFormNote>({ ...FORM_MAIN_PURCHASE_INVOICE_NOTE });
    const [dataTotals, setDataTotals] = useState(DATA_TABLE_TOTALS({ isPurchaseInvoice: true }));
    const [cards, setCards] = useState<IStateCards>({ number: 0, logo: null, urlLogo: '' });
    const [customErrors, setCustomErrors] = useState<string[]>([]);
    const [submit, setSubmit] = useState<boolean>(false);
    const [noteID, setNoteID] = useState<string>('');

    const updateInvoiceDetails = (products: IInvoiceDetails[]): void => {
        dispatch(getInvoiceCalculations({ products, sending_charge: 0, withholdings: DATA_WITHHOLDINGS() }));
    };

    const { scrollToInput } = useScrollToError();
    const { activeModal, toggleModal } = useModal({ ...STATE_MODALS });
    const { symbol } = useSymbolCurrency(formPurchaseNote.foreign_exchange_id, productsStock);
    const { invoiceDetails, propsComponent, setInvoiceDetails, handleDeleteDetail } = useInvoiceDetails({
        foreignExchangeRate: formPurchaseNote.foreign_exchange_rate,
        invoiceType: mainForm.invoice_type,
        handleModal: (): void => toggleModal(Modals.Delete),
        updateInvoiceDetails,
    });

    const validations = useMemo(() => {
        const note = { ...formPurchaseNote, ...mainForm, products: invoiceDetails };
        return submit ? (validateDocument(note, REQUIRED_TEXT) as IValidateNote) : { ...INIT_VALIDATE };
    }, [mainForm, formPurchaseNote, invoiceDetails]);
    const isCreditNote = useMemo(() => mainForm.invoice_type === NotesPurchaseType.CreditNote, [mainForm.invoice_type]);

    const handleResetAll = (): void => {
        setDataTotals(DATA_TABLE_TOTALS({ isPurchaseInvoice: true }));
        setFormPurchaseNote({ ...FORM_PURCHASE_INVOICE_NOTE });
        setInvoiceDetails([]);
        setCustomErrors([]);
        setSubmit(false);
    };

    const assignPurchaseNote = (): void => {
        if (!lengthGreaterThanZero(Object.values(purchaseInvoice))) return;
        const { products, consecutive } = purchaseInvoice;
        setFormPurchaseNote({
            ...formPurchaseNote,
            ...AssignDataToObject(PURCHASE_INVOICE_NOTE_TEMPLATE, purchaseInvoice),
            supplier: AssignDataToObject(SUPPLIER_TEMPLATE, purchaseInvoice.person) as ISupplier,
            supplier_invoice_number: `${consecutive.name}${consecutive.number}`,
        });
        setCards({ ...cards, number: consecutive.number });
        const details = products.map(({ warehouse_name, batch_number, date_expiration, ...product }: IInvoiceDetails) => {
            return {
                ...product,
                warehouse_name: warehouse_name ? warehouse_name : NA,
                batch_number: batch_number ? batch_number : NA,
                taxes: product.product_taxes.map(({ company_tax_id, tax_value }) => ({ company_tax_id, tax_value })),
                date_expiration: date_expiration ? getDateFromUnix(getUnixFromDate(date_expiration || '')).dateFormat : NA,
                percentage_discount: calculatePercentage(product.unit_value, product.discount),
            };
        });
        setInvoiceDetails(details);
        dispatch(getInvoiceCalculations({ products: details, sending_charge: 0, withholdings: DATA_WITHHOLDINGS() }));
    };

    const handleNumber = (name: string) => (values: NumberFormatValues): void => {
        setFormPurchaseNote({
            ...formPurchaseNote,
            [name]: values.floatValue,
        });
    };

    const handleText = ({ target }: ChangeEvent): void => {
        setFormPurchaseNote({
            ...formPurchaseNote,
            [target.name]: target.value,
        });
    };

    const handleDate = (date: Date, name: string): void => {
        setFormPurchaseNote({
            ...formPurchaseNote,
            [name]: getDateAnyFormat(date, FORMAT_YYYY_MM_DD),
        });
    };

    const noteRequest = (): IPurchaseInvoiceNoteRequest => {
        return {
            ...mainForm,
            ...formPurchaseNote,
            ...tableTotalsToJson(invoiceCalculations, []),
            supplier_invoice_number: null,
            products: invoiceDetails.map(item => {
                const isNull = item.warehouse_name === NA;
                const isNullBatch = isNull || item.batch_number === NA;
                return {
                    ...item,
                    warehouse_id: isNull ? null : item.warehouse_id,
                    warehouse_name: isNull ? null : item.batch_number,
                    batch_id: isNullBatch ? null : item.batch_id,
                    batch_number: isNullBatch ? null : item.batch_number,
                    batch_detail_id: isNullBatch ? null : item.batch_detail_id,
                    date_expiration: isNullBatch ? null : getDateISO8601ToDate(item.date_expiration || ''),
                };
            }),
        };
    };

    const handleSubmit = async (): Promise<void> => {
        setSubmit(true);
        const { form, details } = validateDocument(
            { ...mainForm, ...formPurchaseNote, products: invoiceDetails },
            REQUIRED_TEXT,
            true
        ) as IValidateInFunction;
        if (form) return scrollToInput();
        if (details && !form) return scrollToInput(ValidateClassName.ElectronicDocument);
        if (cards.logo?.type) await dispatch(postFileCompanyAction(cards.logo as Blob, INVOICE_LOGO));
        const note = noteRequest();
        const { statusCode, errors = null, data } = ((await dispatch(postPurchaseNote(note))) as unknown) as ResponsePurchaseNote;
        const isCorrect = isCorrectResponse(statusCode);
        if (!isCorrect && errors) {
            setCustomErrors(Object.keys(errors));
            return scrollToInput();
        }
        setNoteID(data?.id ?? '');
        toggleModal(Modals.Save);
        setMainForm({ ...DEFAULT_MAIN_FORM, invoice_type: note.invoice_type });
        handleResetAll();
        dispatch(getDocumentList({ ...DATE_TO_LIST, finish_date: currentDateInUnix() }, true));
    };

    const handleCard = (updateCard: unknown): void => setCards({ ...(updateCard as IStateCards) });

    const handleMainForm = (name: string) => (id: string, option: IOption): void => {
        let form: Partial<IMainFormNote> = {};
        if (name === NameInputs.InvoiceType) {
            form = { ...DEFAULT_MAIN_FORM };
            handleResetAll();
        }
        if (name === NameInputs.InvoiceId) {
            form = { reason_rejection_id: '', reason_rejection_description: '', code_credit_note: null, code_debit_note: null };
            dispatch(getInvoicePurchase(id));
        }
        if (name === NameInputs.ReasonRejectionId) {
            const { code_credit_note, code_debit_note } = utils.reason_rejections.find(
                (item: IUtilReasonRequest) => item.id === id
            ) as IUtilReasonRequest;
            form = {
                reason_rejection_description: option.name,
                code_credit_note: isCreditNote ? code_credit_note : null,
                code_debit_note: !isCreditNote ? code_debit_note : null,
            };
        }
        setMainForm({
            ...mainForm,
            ...form,
            [name]: id,
        });
    };

    const handleTime = (time: string): void => setFormPurchaseNote({ ...formPurchaseNote, time_issue: time });

    const handleSwitchModal = (): void => {
        if (activeModal === Modals.Delete) handleDeleteDetail();
        if (activeModal === Modals.Save) {
            history.push(`${getRoute(Routes.CONSULT_ELECTRONIC_DOCUMENT)}?${ParamsToPage.ID}=${noteID}`);
        }
        toggleModal('');
    };

    const initData = (): void => {
        if (!id || !type) return;
        setMainForm({
            ...mainForm,
            invoice_id: id || '',
            invoice_type: type || NotesPurchaseType.DebitNote,
        });
        if (id) dispatch(getInvoicePurchase(id));
    };

    useEffect(() => {
        setDataTotals(updateTableTotals(invoiceCalculations, undefined, undefined, true));
    }, [invoiceCalculations]);

    useEffect(() => {
        initData();
    }, [id, type]);

    useEffect(() => {
        assignPurchaseNote();
    }, [purchaseInvoice]);

    useEffect(() => {
        (async (): Promise<void> => {
            await Promise.all([
                dispatch(getUniqueProductStock()),
                dispatch(getInformationCompany()),
                dispatch(getUtils([REASON_REJECTIONS, FOREIGN_EXCHANGE])),
                dispatch(getFilesCompanyAction(INVOICE_LOGO)),
                dispatch(getDocumentList({ ...DATE_TO_LIST, finish_date: currentDateInUnix() }, true)),
            ]);
        })();
    }, []);

    return {
        id,
        propsModals: {
            activeModal,
            toggleModal: handleSwitchModal,
            handleClose: (): void => toggleModal(''),
        },
        propsMainForm: {
            submit,
            mainForm,
            handleMainForm,
        },
        propsCards: {
            companyData,
            isEdit: true,
            invoiceData: cards,
            updateInvoiceData: handleCard,
        },
        propsForm: {
            submit,
            customErrors,
            formPurchaseNote,
            handleText,
            handleDate,
            handleTime,
            handleNumber,
        },
        propsTable: {
            ...propsComponent,
            requiredFieldsTable: validations.details,
            symbol,
        },
        propsTotals: {
            symbol,
            dataTotals,
        },
        propsButton: buttonsFooterProps(ModuleApp.ELECTRONIC_INVOICE, history, handleSubmit, { name: '', moduleName: '' }),
    };
};

export default usePurchaseInvoiceNotes;
