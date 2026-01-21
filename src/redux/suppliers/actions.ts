/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import FileSaver from 'file-saver';
import { apiFile } from '@api/file';
import { apiDeleteInvoice, apiGetInvoice, apiPostInvoice, apiPutInvoice, apiUploadInvoice } from '@api/invoice';
import { urls } from '@api/urls';
import { PER_PAGE_RANGE } from '@constants/UtilsConstants';
import { SUPPLIER_EXIST_RESPONSE } from '@constants/Supplier';
import { IFileRequest, IFileType } from '@models/File';
import { IGenericRecord } from '@models/GenericRecord';
import { FetchRequest, FileType, FolderType, ServiceType } from '@models/Request';
import { ISelectedSupplier, ISupplierExist, ISupplierExistResponse, ISupplierResponse } from '@models/Supplier';
import { RootState } from '@redux/rootReducer';
import { fileType } from '@utils/File';
import { isCorrectResponse } from '@utils/Response';
import { getUserData } from '@utils/User';
import {
    ActionKeys,
    ISetError,
    ISetSelectedSupplier,
    ISetSupplierHistory,
    ISetSupplierInvoice,
    ISetSuppliers,
    ISetSuppliersThin,
    SupplierActions,
} from './types';

export const getSuppliers = (isList = false, search = ''): ThunkAction<Promise<void>, RootState, null, SupplierActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, SupplierActions>): Promise<void> => {
        try {
            const request = new FetchRequest(isList? `${urls.suppliers.get}?per_page=${PER_PAGE_RANGE}` :search? `${urls.suppliers.get}?search=${search}` :  urls.suppliers.get);
            const { data }: any = await apiGetInvoice(request);
            dispatch(setSuppliers(data));
        } catch (error) {
            dispatch(setError([String(error)]));
        }
    };
};

export const getSupplierHistory = (supplier: IGenericRecord): ThunkAction<Promise<void>, RootState, null, SupplierActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, SupplierActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.suppliers.getHistory, supplier);
            const { data }: any = await apiPostInvoice(request);
            dispatch(setSupplierHistory(data));
        } catch (error) {
            dispatch(setError([String(error)]));
        }
    };
};

export const getSupplierInvoice = (invoiceId: string): ThunkAction<Promise<void>, RootState, null, SupplierActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, SupplierActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.suppliers.getInvoice(invoiceId));
            const { data }: any = await apiGetInvoice(request);
            dispatch(setSupplierInvoice(data));
        } catch (error) {
            dispatch(setError([String(error)]));
        }
    };
};

export const updateInvoiceScore = (
    scoreList: IGenericRecord[],
    supplier: IGenericRecord
): ThunkAction<Promise<void>, RootState, null, SupplierActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, SupplierActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.suppliers.updateScore, scoreList);
            const { statusCode }: any = await apiPutInvoice(request);
            if (isCorrectResponse(statusCode)) await dispatch(getSupplierHistory(supplier));
            return statusCode;
        } catch (error) {
            dispatch(setError([String(error)]));
        }
    };
};

export const uploadInvoice = (file: FileList): ThunkAction<Promise<void>, RootState, null, SupplierActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, SupplierActions>): Promise<void> => {
        try {
            const { company_id } = getUserData();
            const formData = new FormData();
            formData.append('company_id', company_id);
            formData.append('service', ServiceType.INVOICE);
            formData.append('file', file[0]);
            formData.append('folder', FolderType.VOUCHER);
            formData.append('type', FileType.INVOICE);
            formData.append('bucket_detail_id', '');
            formData.append('data', JSON.stringify({
                data: {
                    uuid_company: company_id
                }
            }));

            const request = new FetchRequest(urls.suppliers.uploadInvoice, formData);
            await apiUploadInvoice(request);
        } catch (error) {
            dispatch(setError([String(error)]));
        }
    };
};

export const postStoreSupplier = (
    requestData: IGenericRecord,
    isBoolean = true
): ThunkAction<Promise<boolean | IGenericRecord>, RootState, IGenericRecord, SupplierActions> => {
    return async (dispatch: ThunkDispatch<RootState, IGenericRecord, SupplierActions>): Promise<boolean | IGenericRecord> => {
        try {
            const { company_id } = getUserData();
            const request = new FetchRequest(urls.suppliers.get, { ...requestData, company_id });
            const data: any = await apiPostInvoice(request);
            return isBoolean ? isCorrectResponse(data.statusCode) : data;
        } catch (error) {
            dispatch(setError([String(error)]));
            return isBoolean ? false : { statusCode: 400 };
        }
    };
};

export const putUpdateSupplier = (
    supplier_id: string,
    requestData: IGenericRecord
): ThunkAction<Promise<void>, RootState, unknown, SupplierActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, SupplierActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.suppliers.getById(supplier_id), requestData);
            const { statusCode }: any = await apiPutInvoice(request);
            return statusCode;
        } catch (error) {
            dispatch(setError([String(error)]));
        }
    };
};

export const deleteSupplier = (
    supplier_ids: IGenericRecord[]
): ThunkAction<Promise<void>, RootState, unknown, SupplierActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, SupplierActions>, getState): Promise<void> => {
        try {
            const { suppliers:{data:suppliers} } = getState().suppliers;
            let newData = [...suppliers];
            const request = new FetchRequest(urls.suppliers.get, supplier_ids);
            const response: any = await apiDeleteInvoice(request);
            supplier_ids.map(item => {
                newData = newData?.filter(supplier => supplier.id !== item.id);
            });
            dispatch(setSuppliers(newData));
            dispatch(getSupplierThin());
            return response;
        } catch (error) {
            dispatch(setError([String(error)]));
        }
    };
};

export const getReportSuppliers = (dataFile: IFileRequest): ThunkAction<Promise<void>, RootState, unknown, SupplierActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, SupplierActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.getFile, dataFile);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await apiFile(request);
            const blob = new Blob([response], {
                type: fileType[dataFile.type as keyof IFileType],
            });
            FileSaver.saveAs(blob, `suppliers-report.${dataFile.type}`);
        } catch (error) {
            dispatch(setError([String(error)]));
        }
    };
};

export const postMandate = (mandate: IGenericRecord): ThunkAction<Promise<boolean>, RootState, null, SupplierActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, SupplierActions>): Promise<boolean> => {
        try {
            const { company_id } = getUserData();
            const request = new FetchRequest(urls.suppliers.createMandate, {
                ...mandate,
                company_id,
            });
            const { statusCode, errors = [] }: any = await apiPostInvoice(request);
            const isSuccess = isCorrectResponse(statusCode);
            if (isSuccess) {
                await Promise.all([dispatch(getSuppliers()), dispatch(getSupplierThin()), dispatch(setError([]))]);
            } else {
                await dispatch(setError(errors));
            }
            return isSuccess;
        } catch (error) {
            dispatch(setError([String(error)]));
            return false;
        }
    };
};

export const putMandate = (updateMandate: IGenericRecord): ThunkAction<Promise<boolean>, RootState, null, SupplierActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, SupplierActions>): Promise<boolean> => {
        try {
            const { company_id } = getUserData();
            const request = new FetchRequest(urls.suppliers.updateMandate(updateMandate.id), {
                ...updateMandate,
                company_id,
            });
            const { statusCode, errors }: any = await apiPutInvoice(request);
            const isSuccess = isCorrectResponse(statusCode);
            if (isSuccess) {
                await dispatch(getSuppliers());
                await dispatch(setError([]));
                await dispatch(getSupplierThin());
            } else {
                await dispatch(setError(errors));
            }
            return isSuccess;
        } catch (error) {
            dispatch(setError([String(error)]));
            return false;
        }
    };
};

export const getSupplierThin = (): ThunkAction<Promise<void>, RootState, unknown, SupplierActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, SupplierActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.suppliers.getSuppliers);
            const { data, statusCode }: any = await apiGetInvoice(request);
            if (isCorrectResponse(statusCode)) {
                await dispatch(setSuppliersThin(data));
            }
        } catch (error) {
            dispatch(setError([String(error)]));
        }
    };
};

export const postExistDuplicateSupplier = (supplierExist: ISupplierExist): ThunkAction<Promise<ISupplierExistResponse>, RootState, unknown, SupplierActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, SupplierActions>): Promise<ISupplierExistResponse> => {
        try {
            const { company_id } = getUserData();
            const request = new FetchRequest(urls.suppliers.getSupplierIsCreated(company_id), supplierExist);
            const { data, statusCode }: any = await apiPostInvoice(request);
            if (isCorrectResponse(statusCode)) return data;
            return SUPPLIER_EXIST_RESPONSE;
        } catch (error) {
            dispatch(setError([String(error)]));
            return SUPPLIER_EXIST_RESPONSE;
        }
    }
}

export const getSupplier = (id: string): ThunkAction<Promise<ISupplierResponse | null>, RootState, unknown, SupplierActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, SupplierActions>): Promise<ISupplierResponse | null> => {
        try {
            const request = new FetchRequest(urls.suppliers.getById(id));
            const { data, statusCode }: any = await apiGetInvoice(request);
            if (isCorrectResponse(statusCode)) {
                return data;
            }
            return null;
        } catch (error) {
            dispatch(setError([String(error)]));
            return null;
        }
    };
}

export const setSuppliers = (suppliers: IGenericRecord[]): ISetSuppliers => ({
    type: ActionKeys.SET_SUPPLIERS,
    suppliers,
});

export const setSuppliersThin = (suppliersThin: IGenericRecord[]): ISetSuppliersThin => ({
    type: ActionKeys.SET_SUPPLIERS_THIN,
    suppliersThin,
});

export const setSupplierInvoice = (invoice: IGenericRecord): ISetSupplierInvoice => ({
    type: ActionKeys.SET_SUPPLIER_INVOICE,
    invoice,
});

export const setSupplierHistory = (supplierHistory: IGenericRecord[]): ISetSupplierHistory => ({
    type: ActionKeys.SET_SUPPLIER_HISTORY,
    supplierHistory,
});

export const setSelectedSupplier = (selectedSupplier: ISelectedSupplier): ISetSelectedSupplier => ({
    type: ActionKeys.SET_SELECTED_SUPPLIER,
    selectedSupplier,
});

export const setError = (error: IGenericRecord): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});
