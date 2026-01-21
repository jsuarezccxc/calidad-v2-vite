import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { getInvoiceCalculations } from '@redux/electronic-invoice/actions';
import { ITaxesProductsStock } from '@models/Inventory';
import { IAdjustmentNoteForm } from '@models/AdjustmentNote';
import { ActionType } from '@models/CorrectCancelElectronicDocument';
import { IInvoiceDetails, ITableTaxesAndRetention } from '@models/ElectronicInvoice';
import { calculatePercentage } from '@utils/Number';
import { tableTotalsToJson } from '@utils/ElectronicNote';
import { currentDateInUnix, getDateFromUnix, getUnixFromDate } from '@utils/Date';
import { NotesContext } from '@pages/correct-cancel-electronic-document/context';
import { IDataTableTotals } from '@components/table-totals';
import { AdjustmentNote } from '@components/adjustment-note';
import { ADJUSTMENT_NOTE, DATA_TABLE_TOTALS, DATA_TAXES, DATA_WITHHOLDINGS, NA } from '@constants/ElectronicInvoice';

export const CreateAdjustmentNote: React.FC = () => {
    const dispatchRedux = useDispatch();
    const {
        validations: {
            validateNote: {
                retentions: [messageFuente, messageIca, messageIva],
                ...validateNote
            },
        },
        electronicDocument,
        products,
        optionsForm,
        ...context
    } = useContext(NotesContext);
    const invoiceCalculation = useSelector((state: RootState) => state.electronicInvoice.invoiceCalculations);
    const [documentData, setDocumentData] = useState<IAdjustmentNoteForm>({ ...electronicDocument } as IAdjustmentNoteForm);
    const [tableAdjustmentNote, setTableAdjustmentNote] = useState<IInvoiceDetails[]>([]);
    const [tableTaxes, setTableTaxes] = useState<ITableTaxesAndRetention[]>([...DATA_TAXES]);
    const [tableRetention, setTableRetention] = useState<ITableTaxesAndRetention[]>([...DATA_WITHHOLDINGS(true)]);
    const [tableTotals, setTableTotals] = useState<IDataTableTotals[]>([...DATA_TABLE_TOTALS({ isSupportOrDocument: true })]);

    useEffect(() => {
        return (): void => {
            context.resetNote();
        };
    }, []);

    useEffect(() => {
        const listProducts =
            electronicDocument?.products?.map(({ is_product, date_expiration, ...item }: IInvoiceDetails) => ({
                ...item,
                is_product,
                warehouse_name: !is_product ? NA : item.warehouse_name || NA,
                batch_number: !is_product ? NA : item.batch_number || NA,
                date_expiration:
                    !is_product || !date_expiration ? NA : getDateFromUnix(getUnixFromDate(date_expiration)).dateFormat,
                percentage_discount: calculatePercentage(item.unit_value, item.discount),
                taxes: item.product_taxes?.map(({ company_tax_id, tax_value }: ITaxesProductsStock) => ({
                    company_tax_id,
                    tax_value,
                })),
            })) || [];
        const {
            withholdings,
            consecutive: { prefix_id, name, number },
        } = electronicDocument;
        setTableAdjustmentNote([...listProducts]);
        setTableRetention([...withholdings]);
        setDocumentData({
            ...(electronicDocument as IAdjustmentNoteForm),
            fiscal_responsibilities: electronicDocument.person.fiscal_responsibilities,
            date: getDateFromUnix(currentDateInUnix()).formatYearMonthDay || '',
            ...(electronicDocument.invoice_type === ADJUSTMENT_NOTE
                ? {
                      prefix_id,
                      prefix_name: name,
                  }
                : {
                      id: null,
                      prefix_id: '',
                      prefix_name: '',
                      annulment: false,
                      prefix_name_associated: name,
                      prefix_id_associated: prefix_id,
                      prefix_number_associated: number,
                      invoice_id: electronicDocument.id,
                  }),
            preview: false,
        });
        dispatchRedux(
            getInvoiceCalculations({ products: listProducts, sending_charge: electronicDocument.sending_charge, withholdings })
        );
    }, [electronicDocument]);

    useEffect(() => {
        context.dispatch({
            type: ActionType.SET_NOTE,
            note: {
                ...documentData,
                ...tableTotalsToJson(invoiceCalculation, tableRetention),
                taxes: tableTaxes,
                products: tableAdjustmentNote,
                withholdings: tableRetention,
            },
        });
    }, [documentData, tableAdjustmentNote, tableTaxes, tableRetention]);

    return (
        <AdjustmentNote
            form={documentData}
            productsStock={products}
            setForm={setDocumentData}
            tableTotals={tableTotals}
            optionsForm={optionsForm}
            setTableTotals={setTableTotals}
            tableRetentions={tableRetention}
            originalData={electronicDocument}
            requiredFormFields={validateNote.form}
            setTableTaxes={setTableTaxes}
            setTableRetentions={setTableRetention}
            tableAdjustmentNote={tableAdjustmentNote}
            requiredFieldsTable={validateNote.details}
            setTableAdjustmentNote={setTableAdjustmentNote}
            errorRetentions={{ messageFuente, messageIca, messageIva }}
            submit
        />
    );
};
