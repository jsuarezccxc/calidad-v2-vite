/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { IGenericRecord } from '@models/GenericRecord';
import { IInvoiceQuoteState } from './types';
import { FetchRequest } from '@models/Request';
import { ICalculateInvoice, IInvoiceCalculates } from '@models/ElectronicInvoice';
import { urls } from '@api/urls';
import {
    apiGetInvoice,
    apiGetInvoicesAvailable,
    apiPostInvoice,
    apiPutInvoice,
    apiSendMailAttachment,
    apiSendMailInvoice,
} from '@api/invoice';
import { apiGetInventory } from '@api/inventory';
import { apiFile, apiGetFile } from '@api/file';
import { apiPostPrefix } from '@api/prefix';
import { createFormData } from '@utils/FormData';
import { getUserData } from '@utils/User';
import { isCorrectResponse } from '@utils/Response';
import { SUCCESS_RESPONSE } from '@constants/StatusCodes';
import { VARIABLE_TYPE } from '@constants/DataTypes';
import { PER_PAGE_RANGE } from '@constants/UtilsConstants';
import { INVOICE_CALCULATES } from '@constants/ElectronicInvoice';
import { IFile } from '@components/input';

import {
    ActionKeys,
    IError,
    ElectronicInvoiceActions,
    ISetListIssuedDocument,
    ISetSelectedDocument,
    ISetListDocumentsRequireAction,
    ISetCustomer,
    ISetReportSalesRecords,
    ISetElectronicInvoice,
    ISetProducts,
    ISetConsecutive,
    ISetListInvoice,
    ISetInvoicesAvailable,
    ISetValidateClient,
    ISetListIncomeExpenses,
    ISetXml,
    ISetList,
    ISetPrefixCompany,
    ISetInvoiceCalculations,
    ISetPrefixes,
    ISetInvoicePrefix,
    ISetInvoiceState,
} from './types';

export const setListIssuedDocument = (issuedDocuments: IGenericRecord[]): ISetListIssuedDocument => ({
    type: ActionKeys.SET_LIST_ISSUED_DOCUMENT,
    issuedDocuments,
});

export const setCustomerByDocument = (customer: IGenericRecord): ISetCustomer => ({
    type: ActionKeys.GET_CUSTOMER,
    customer,
});

export const setProductsInventory = (products: IGenericRecord[]): ISetProducts => ({
    type: ActionKeys.GET_PRODUCTS,
    products,
});

export const setListInvoices = (invoices: IGenericRecord[]): ISetListInvoice => ({
    type: ActionKeys.GET_LIST_INVOICE,
    invoices,
});

export const setConsecutive = (consecutive: IGenericRecord): ISetConsecutive => ({
    type: ActionKeys.GET_CONSECUTIVE,
    consecutive,
});

export const setElectronicInvoice = (invoice: IGenericRecord): ISetElectronicInvoice => ({
    type: ActionKeys.GET_ELECTRONIC_INVOICE,
    invoice,
});

export const setReportSalesRecords = (reportSalesRecords: IGenericRecord[]): ISetReportSalesRecords => ({
    type: ActionKeys.GET_REPORT_SALES_RECORDS,
    reportSalesRecords,
});

export const setSelectedDocument = (document: IGenericRecord): ISetSelectedDocument => ({
    type: ActionKeys.SET_SELECTED_DOCUMENT,
    document,
});

export const setListDocumentsRequireAction = (documentsRequireAction: IGenericRecord[]): ISetListDocumentsRequireAction => ({
    type: ActionKeys.SET_LIST_DOCUMENTS_REQUIRE_ACTION,
    documentsRequireAction,
});

export const setInvoicesAvailable = (quantityInvoices: IGenericRecord): ISetInvoicesAvailable => ({
    type: ActionKeys.GET_INVOICES_AVAILABLE,
    quantityInvoices,
});

export const setValidateCliente = (validateClient: IGenericRecord): ISetValidateClient => ({
    type: ActionKeys.GET_VALIDATE_INFO_CLIENT,
    validateClient,
});

export const setIncomeExpenses = (incomeExpenses: IGenericRecord): ISetListIncomeExpenses => ({
    type: ActionKeys.SET_LIST_INCOME_EXPENSES,
    incomeExpenses,
});

export const setXml = (xml: string): ISetXml => ({
    type: ActionKeys.SET_XML,
    payload: xml,
});

export const setAdjustmentNote = (payload: IGenericRecord[]): ISetList => ({
    type: ActionKeys.SET_LIST,
    payload,
});

export const setPrefixCompany = (payload: IGenericRecord[]): ISetPrefixCompany => ({
    type: ActionKeys.GET_PREFIX,
    payload,
});

export const setError = (error: string): IError => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const setInvoiceCalculations = (invoiceCalculations: IInvoiceCalculates): ISetInvoiceCalculations => ({
    type: ActionKeys.SET_INVOICE_CALCULATIONS,
    invoiceCalculations,
});

export const setPrefixes = (payload: IGenericRecord[]): ISetPrefixes => ({
    type: ActionKeys.SET_PREFIXES,
    payload,
});

export const setInvoicePrefix = (data: IGenericRecord): ISetInvoicePrefix => ({
    type: ActionKeys.SET_INVOICE_PREFIX,
    payload: data,
});

export const setStateInvoice = (stateInvoice: IInvoiceQuoteState | IGenericRecord): ISetInvoiceState => ({
    type: ActionKeys.SET_STATE_INVOICE,
    stateInvoice,
});

export const getIssuedDocuments = (dataRequest: {
    start_date: number;
    finish_date: number;
}): ThunkAction<Promise<void>, RootState, null, ElectronicInvoiceActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ElectronicInvoiceActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.issuedDocuments, dataRequest);
            const { data }: any = await apiPostInvoice(request);
            const newData = data.map((item: IGenericRecord) => {
                item.rejected_reason = item.rejected_reason || 'N/A';
                return { ...item };
            });
            dispatch(setListIssuedDocument(newData));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getListDocumentRequireAction = (dataRequest: {
    start_date: number;
}): ThunkAction<Promise<void>, RootState, null, ElectronicInvoiceActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ElectronicInvoiceActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.documentAction, dataRequest);
            const { data }: any = await apiPostInvoice(request);
            dispatch(setListDocumentsRequireAction(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const sendMailAttachment = (
    { subject, type, client_email, name_user, company_name, invoice_pdf_url }: IGenericRecord,
    file: FileList,
    body: string
): ThunkAction<Promise<void>, RootState, null, ElectronicInvoiceActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ElectronicInvoiceActions>): Promise<void> => {
        try {
            const formData = createFormData([
                { key: 'logo_url', value: '' },
                { key: 'subject', value: subject },
                { key: 'name_user', value: name_user },
                { key: 'client_email', value: client_email },
                { key: 'body_content', value: body },
                { key: 'company_name', value: company_name },
                { key: 'invoice_type', value: type },
                { key: 'invoice_pdf_url', value: invoice_pdf_url },
                { key: file ? 'file' : '', value: file && file },
            ]);

            const request = new FetchRequest(urls.notification.send_electronic_document, formData);
            const { statusCode }: any = await apiSendMailAttachment(request);
            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postDocumentCredits = (
    dataRequest: IGenericRecord[]
): ThunkAction<Promise<void>, RootState, null, ElectronicInvoiceActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ElectronicInvoiceActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.storeMoneyInstallments, dataRequest);
            const { statusCode }: any = await apiPostInvoice(request);
            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getInformationByIdentification = (
    document: string,
    isSetCustomer = true
): ThunkAction<Promise<any>, RootState, null, ElectronicInvoiceActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ElectronicInvoiceActions>): Promise<any> => {
        try {
            const request = new FetchRequest(urls.invoice.getInformationByIdentification(document));
            const { data }: any = await apiGetInvoice(request);
            if (!Array.isArray(data) && data && isSetCustomer) await dispatch(setCustomerByDocument(data));
            return data;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const createElectronicInvoiceAction = (
    dataInvoice: IGenericRecord
): ThunkAction<Promise<void>, RootState, unknown, ElectronicInvoiceActions> => {
    return async (dispatch: ThunkDispatch<RootState, any, ElectronicInvoiceActions>): Promise<any> => {
        try {
            const request = new FetchRequest(urls.invoice.createInvoice, dataInvoice);
            const { statusCode, data, errors }: any = await apiPostInvoice(request);
            if (!isCorrectResponse(statusCode) && typeof errors === VARIABLE_TYPE.OBJECT)
                dispatch(setError(JSON.stringify(errors)));
            return { statusCode, data };
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const CreateQuoteAction = (
    dataInvoice: IGenericRecord
): ThunkAction<Promise<void>, RootState, unknown, ElectronicInvoiceActions> => {
    return async (dispatch: ThunkDispatch<RootState, any, ElectronicInvoiceActions>): Promise<any> => {
        try {
            const request = new FetchRequest(urls.invoice.quotes.create, dataInvoice);
            const { statusCode, data }: any = await apiPostInvoice(request);
            return { statusCode, data };
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const createElectronicInvoiceExcelAction = (
    dataRequest: IGenericRecord
): ThunkAction<Promise<void>, RootState, unknown, ElectronicInvoiceActions> => {
    return async (dispatch: ThunkDispatch<RootState, any, ElectronicInvoiceActions>): Promise<any> => {
        try {
            const request = new FetchRequest(urls.invoice.createInvoiceExcel, dataRequest);
            const { statusCode, data }: any = await apiPostInvoice(request);
            return { statusCode, data };
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getReportSalesRecords = (): ThunkAction<Promise<void>, RootState, null, ElectronicInvoiceActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ElectronicInvoiceActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.reportSalesRecords);
            const { data }: any = await apiGetInvoice(request);
            dispatch(setReportSalesRecords(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getElectronicInvoice = (id: string): ThunkAction<Promise<void>, RootState, null, ElectronicInvoiceActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ElectronicInvoiceActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.getElectronicInvoice(id));
            const { data }: any = await apiGetInvoice(request);
            dispatch(setElectronicInvoice(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getUniqueProductStock = (
    option?: IGenericRecord
): ThunkAction<Promise<void>, RootState, null, ElectronicInvoiceActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ElectronicInvoiceActions>): Promise<void> => {
        try {
            const url = option ? `${urls.inventory.companyStock}?option=${option.option}` : urls.inventory.companyStock;
            const request = new FetchRequest(url);
            const { data = [] }: any = await apiGetInventory(request);
            dispatch(setProductsInventory(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const cancelSalesInvoiceAction = (id: string): ThunkAction<Promise<void>, RootState, null, ElectronicInvoiceActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ElectronicInvoiceActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.cancelSalesInvoice(id), []);
            const { statusCode }: any = await apiPutInvoice(request);
            if (SUCCESS_RESPONSE.includes(Number(statusCode))) {
                await dispatch(getReportSalesRecords());
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const editElectronicInvoiceAction = (
    id: string,
    data: IGenericRecord
): ThunkAction<Promise<void>, RootState, unknown, ElectronicInvoiceActions> => {
    return async (dispatch: ThunkDispatch<RootState, any, ElectronicInvoiceActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.editInvoice(id), data);
            const { statusCode }: any = await apiPutInvoice(request);
            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const updateEmailFromCustomer = (
    idPerson: string,
    data: IGenericRecord
): ThunkAction<Promise<void>, RootState, unknown, ElectronicInvoiceActions> => {
    return async (dispatch: ThunkDispatch<RootState, any, ElectronicInvoiceActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.updateEmailCustomer(idPerson), data);
            const { statusCode }: any = await apiPutInvoice(request);
            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getConsecutives = (url: string) => {
    return async (dispatch: ThunkDispatch<RootState, null, ElectronicInvoiceActions>): Promise<void> => {
        try {
            const request = new FetchRequest(url);
            const { data }: any = await apiGetInvoice(request);
            dispatch(setConsecutive(data));
            return data;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getInvoiceExcel = (
    invoices: IGenericRecord[]
): ThunkAction<Promise<void>, RootState, unknown, ElectronicInvoiceActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, ElectronicInvoiceActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.getListInvoice, invoices);
            const { data }: any = await apiPostInvoice(request);
            dispatch(setListInvoices(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getInvoicesAvailable = (): ThunkAction<Promise<void>, RootState, null, ElectronicInvoiceActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ElectronicInvoiceActions>): Promise<void> => {
        try {
            const { company_id } = getUserData();
            const request = new FetchRequest(urls.invoice.getInvoicesAvailable(company_id));
            const { data }: any = await apiGetInvoicesAvailable(request);
            dispatch(setInvoicesAvailable(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const validateEmailDocumentClient = (
    client: IGenericRecord
): ThunkAction<Promise<void>, RootState, null, ElectronicInvoiceActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ElectronicInvoiceActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.validateClient, client);
            const response: any = await apiPostInvoice(request);
            dispatch(setValidateCliente(response?.data));
            return response;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getIncomeExpensesBilling = (
    dataFrom: IGenericRecord
): ThunkAction<Promise<void>, RootState, null, ElectronicInvoiceActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ElectronicInvoiceActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.reportIncomeEgressWarehouse, {
                start_date: dataFrom.initialDate,
                finish_date: dataFrom.finishDate,
                ...dataFrom,
            });
            const { data }: any = await apiPostInvoice(request);
            dispatch(setIncomeExpenses(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const downloadXml = (
    fileId: string,
    isAuth = true,
    xmlToken = ''
): ThunkAction<Promise<void>, RootState, null, ElectronicInvoiceActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ElectronicInvoiceActions>): Promise<void> => {
        try {
            const { getXml, postXml } = urls.electronic_invoice;
            const url = isAuth ? getXml(fileId) : postXml;
            const requestBody = isAuth ? { file_type: 'xml' } : { xml_token: xmlToken };
            const request = new FetchRequest(url, requestBody);
            const action = isAuth ? apiGetFile : apiFile;
            const response: any = await action(request);
            const blob = response instanceof Blob ? response : await response.blob();
            const urlFront = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = urlFront;
            a.download = `${fileId}.xml`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const setAgreement = (
    invoiceData: IGenericRecord
): ThunkAction<Promise<void>, RootState, null, ElectronicInvoiceActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ElectronicInvoiceActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.setAgreement, invoiceData);
            await apiPostInvoice(request);
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getDocumentList = (
    parameterList: IGenericRecord,
    isList = false,
    search = ''
): ThunkAction<Promise<void>, RootState, null, ElectronicInvoiceActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ElectronicInvoiceActions>): Promise<void> => {
        try {
            const request = new FetchRequest(
                isList
                    ? `${urls.invoice.getDocumentList}?per_page=${PER_PAGE_RANGE}`
                    : search
                    ? `${urls.invoice.getDocumentList}?search=${search}`
                    : urls.invoice.getDocumentList,
                parameterList
            );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiPostInvoice(request);
            if (isCorrectResponse(statusCode)) dispatch(setAdjustmentNote(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getPrefixCompany = (
    data: IGenericRecord,
    replacePrefixes = false
): ThunkAction<Promise<void>, RootState, null, ElectronicInvoiceActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ElectronicInvoiceActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.getPrefixCompany, data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: prefixes }: any = await apiPostInvoice(request);
            if (Array.isArray(prefixes)) {
                dispatch(setPrefixCompany(prefixes));
                if (replacePrefixes) dispatch(setPrefixes(prefixes));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postTemplateEmail = (
    documentId: string,
    subject: string,
    bodyContent: string,
    type: string,
    image?: FileList | File | IFile
): ThunkAction<Promise<IGenericRecord>, RootState, unknown, ElectronicInvoiceActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, ElectronicInvoiceActions>): Promise<IGenericRecord> => {
        try {
            const formData = createFormData([
                { key: 'id', value: documentId },
                { key: 'subject', value: subject },
                { key: 'body_content', value: bodyContent },
                { key: 'invoice_type', value: type },
                { key: image ? 'file' : '', value: image && (image as any) },
            ]);
            const request = new FetchRequest(urls.invoice.sendEmail, formData);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { statusCode }: any = await apiSendMailInvoice(request);
            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
            return { url: '', error: String(error) };
        }
    };
};

export const getInvoiceCalculations = (
    data: ICalculateInvoice | IGenericRecord
): ThunkAction<Promise<IGenericRecord | null>, RootState, null, ElectronicInvoiceActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ElectronicInvoiceActions>): Promise<IGenericRecord | null> => {
        try {
            const request = new FetchRequest(urls.invoice.getCalculateInvoice, data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: calculations, statusCode, errors }: any = await apiPostInvoice(request);

            if (calculations && isCorrectResponse(statusCode)) {
                dispatch(setInvoiceCalculations(calculations));
                return calculations;
            }
            if (errors) {
                dispatch(setInvoiceCalculations({ ...INVOICE_CALCULATES }));
                return null;
            }

            return null;
        } catch (error) {
            dispatch(setError(String(error)));
            return null;
        }
    };
};

export const getPrefix = (prefix: string): ThunkAction<Promise<void>, RootState, null, ElectronicInvoiceActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ElectronicInvoiceActions>): Promise<void> => {
        try {
            const { company_id } = getUserData();

            const request = new FetchRequest(urls.prefix.specific, { prefix_id: prefix, company_id });
            const { data }: any = await apiPostPrefix(request);
            if (data) dispatch(setInvoicePrefix(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};
