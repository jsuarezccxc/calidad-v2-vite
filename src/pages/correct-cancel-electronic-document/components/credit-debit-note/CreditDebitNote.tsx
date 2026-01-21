import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IElectronicNoteForm } from '@models/ElectronicNote';
import { ActionType } from '@models/CorrectCancelElectronicDocument';
import { IInvoiceDetails, ITableTaxesAndRetention } from '@models/ElectronicInvoice';
import { KEYS_VALUES } from '@constants/ElectronicNote';
import { TypeTransaction } from '@constants/BuildProduct';
import { CREDIT_NOTE, DATA_TABLE_TOTALS, DATA_TAXES, DATA_WITHHOLDINGS, DEBIT_NOTE } from '@constants/ElectronicInvoice';
import { assignValue } from '@utils/Json';
import { tableTotalsToJson } from '@utils/ElectronicNote';
import { assignDocument, filterTypeTransactionProduct } from '@utils/ElectronicInvoice';
import { NotesContext } from '@pages/correct-cancel-electronic-document/context';
import { RootState } from '@redux/rootReducer';
import { getInvoiceCalculations } from '@redux/electronic-invoice/actions';
import { IDataTableTotals } from '@components/table-totals';
import { ElectronicNote, formatDataTableMain, typeNote } from '@components/electronic-note';
import { utils } from '.';
import './CreditDebitNote.scss';

export const CreditDebitNote: React.FC = () => {
    const dispatchRedux = useDispatch();
    const {
        products,
        electronicDocument,
        state: { mainForm },
        validations: {
            validateNote: {
                retentions: [messageFuente, messageIca, messageIva],
                ...validateNote
            },
        },
        ...context
    } = useContext(NotesContext);
    const invoiceCalculation = useSelector((state: RootState) => state.electronicInvoice.invoiceCalculations);
    const [fieldsValues, setFieldsValues] = useState<IElectronicNoteForm>({
        ...utils.initForm,
        ...assignValue(KEYS_VALUES, electronicDocument),
    } as IElectronicNoteForm);
    const [tableNote, setTableNote] = useState<IInvoiceDetails[]>([]);
    const [tableTaxes, setTableTaxes] = useState<ITableTaxesAndRetention[]>([...DATA_TAXES]);
    const [tableRetention, setTableRetention] = useState<ITableTaxesAndRetention[]>([...DATA_WITHHOLDINGS()]);
    const [tableTotals, setTableTotals] = useState<IDataTableTotals[]>([...DATA_TABLE_TOTALS({})]);
    const isDebitNote = typeNote(mainForm.typeNote);
    useEffect(() => {
        return (): void => {
            context.resetNote();
        };
    }, []);

    useEffect(() => {
        context.dispatch({
            type: ActionType.SET_NOTE,
            note: {
                ...fieldsValues,
                ...tableTotalsToJson(invoiceCalculation, tableRetention),
                taxes: tableTaxes,
                products: tableNote,
                withholdings: tableRetention,
            },
        });
    }, [fieldsValues, tableNote, tableTaxes, tableRetention, tableTotals]);

    useEffect(() => {
        setFieldsValues({
            ...utils.initForm,
            ...assignValue(KEYS_VALUES, electronicDocument),
            ...([DEBIT_NOTE, CREDIT_NOTE].includes(electronicDocument.invoice_type) && {
                prefix_id_associated: electronicDocument.prefix_id_associated,
                number_associated: electronicDocument.prefix_number_associated,
                associated_document_prefix:
                    electronicDocument.prefix_name_associated + electronicDocument.prefix_number_associated,
                prefix_id: electronicDocument.consecutive.prefix_id,
                prefix_name: electronicDocument.consecutive.name,
            }),
        } as IElectronicNoteForm);
        const { withholdings } = assignDocument(electronicDocument);
        const invoiceDetails = formatDataTableMain(electronicDocument.invoice_details, products);
        setTableNote([...invoiceDetails]);
        setTableRetention([...withholdings]);
        dispatchRedux(
            getInvoiceCalculations({ products: invoiceDetails, sending_charge: electronicDocument.sending_charge, withholdings })
        );
    }, [electronicDocument, products]);

    return (
        <div className="visualization-notes">
            <ElectronicNote
                className="rounded mr-3.75"
                products={filterTypeTransactionProduct(products, TypeTransaction.Buy)}
                fieldsValues={fieldsValues}
                setFieldsValues={setFieldsValues}
                tableNote={tableNote}
                setTableNote={setTableNote}
                tableRetention={tableRetention}
                setTableTaxes={setTableTaxes}
                setTableRetention={setTableRetention}
                tableTotals={tableTotals}
                setTableTotals={setTableTotals}
                optionsForm={context.optionsForm}
                errorsCustom={validateNote.form}
                errorsTableProduct={validateNote.details}
                errorsTableRetention={{
                    messageFuente,
                    messageIca,
                    messageIva,
                }}
                isDebitNote={isDebitNote}
                isSubmit
            />
        </div>
    );
};
