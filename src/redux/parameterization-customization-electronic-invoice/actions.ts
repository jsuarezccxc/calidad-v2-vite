/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { urls } from '@api/urls';
import { apiPostUtils } from '@api/inventory';
import { apiBucketPostFormData } from '@api/bucket';
import { apiGetPrefix, apiPostPrefix, apiDeletePrefix } from '@api/prefix';
import { apiGetElectronic, apiPostElectronic } from '@api/electronicBilling';
import { apiDeleteCompany, apiPostCompany, apiPutCompany } from '@api/company';
import { RootState } from '@redux/rootReducer';
import { getInformationCompany } from '@redux/company/actions';
import { getFileCompanyAction } from '@redux/website-node/actions';
import {
    IGetPrefixCompany,
    ActionKeys,
    ISetError,
    parameterizationInvoice,
    IGetFileRut,
    IGetFileLogo,
    initialStateFile,
    IGetCertificateInfo,
    IGetPrefixSynchronizeCompany,
    IGetPrefixPurchaseByCompany,
    ISetUtils,
} from '@redux/parameterization-customization-electronic-invoice/types';
import { IFileResponse } from '@models/File';
import { IGenericRecord } from '@models/GenericRecord';
import { ServiceType, FetchRequest } from '@models/Request';
import { getUserData } from '@utils/User';
import { formatUtils } from '@utils/DynamicData';
import { isCorrectResponse } from '@utils/Response';
import { lengthGreaterThanZero } from '@utils/Length';
import { FILE } from '@constants/File';
import { SIGNER_ROLE, TypeFile } from '@constants/ElectronicInvoice';
import { FISCAL_RESPONSIBILITIES, FOREIGN_EXCHANGE, TAX_DETAILS } from '@constants/UtilsConstants';

export const getPrefixCompany = (payload: IGenericRecord[]): IGetPrefixCompany => ({
    type: ActionKeys.GET_PREFIX_COMPANY,
    payload,
});

export const getPrefixPurchaseByCompany = (payload: IGenericRecord[]): IGetPrefixPurchaseByCompany => ({
    type: ActionKeys.GET_PREFIX_PURCHASE_BY_COMPANY,
    payload,
});

export const getPrefixSynchronizeCompany = (payload: IGenericRecord[]): IGetPrefixSynchronizeCompany => ({
    type: ActionKeys.GET_PREFIX_SYNCHRONIZE_COMPANY,
    payload,
});

export const setFileRut = (filesResponse: IFileResponse): IGetFileRut => ({
    type: ActionKeys.GET_FILE_RUT,
    file: filesResponse,
});

export const setFileLogo = (filesResponse: IFileResponse): IGetFileLogo => ({
    type: ActionKeys.GET_FILE_LOGO,
    file: filesResponse,
});

export const setCertificateInfo = (certificateInfo: IGenericRecord): IGetCertificateInfo => ({
    type: ActionKeys.SET_CERTIFICATE_INFO,
    certificateInfo,
});

export const setUtils = (utils: IGenericRecord): ISetUtils => ({
    type: ActionKeys.SET_UTILS,
    payload: utils,
});

export const setError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const getPrefixPurchaseByCompanyAction = (request: {
    prefix: string;
}): ThunkAction<Promise<void>, RootState, unknown, IGetPrefixCompany> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, parameterizationInvoice>): Promise<void> => {
        try {
            const fetchRequest = new FetchRequest(urls.prefix.prefixPurchaseByCompany, request);
            const response: any = await apiPostPrefix(fetchRequest);
            dispatch(getPrefixPurchaseByCompany(response.data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postPrefixCompanyAction = (
    data: IGenericRecord
): ThunkAction<Promise<void>, RootState, null, parameterizationInvoice> => {
    return async (dispatch: ThunkDispatch<RootState, null, parameterizationInvoice>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.prefix.prefix, data);
            const { statusCode }: any = await apiPostPrefix(request);
            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postPrefixNotesCompanyAction = (
    types: IGenericRecord
): ThunkAction<Promise<void>, RootState, null, parameterizationInvoice> => {
    return async (dispatch: ThunkDispatch<RootState, null, parameterizationInvoice>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.prefix.notes, types);
            const { statusCode, data }: any = await apiPostPrefix(request);
            dispatch(getPrefixCompany(data));
            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postFileCompanyAction = (
    file: Blob,
    type: string
): ThunkAction<Promise<void>, RootState, null, parameterizationInvoice> => {
    return async (dispatch: ThunkDispatch<RootState, null, parameterizationInvoice>): Promise<void> => {
        try {
            const { company_id } = getUserData();
            const details = JSON.stringify({ uuid_company: company_id });
            const requestFormData = new FormData();

            requestFormData.append('company_id', company_id);
            requestFormData.append('folder', type);
            requestFormData.append('file', file);
            requestFormData.append('service', ServiceType.SECURITY);
            requestFormData.append('data', details);
            requestFormData.append('resource', urls.bucketUploadFile);
            requestFormData.append('method', 'post');
            const request = new FetchRequest(urls.prefix.postFile, requestFormData);
            const { statusCode }: any = await apiBucketPostFormData(request);
            await dispatch(getFileCompanyAction());
            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postSaveConfigurationAction = (
    requestCertificate: IGenericRecord,
    file?: Blob,
    sendFile?: boolean
): ThunkAction<Promise<void>, RootState, null, parameterizationInvoice> => {
    return async (dispatch: ThunkDispatch<RootState, null, parameterizationInvoice>): Promise<void> => {
        try {
            const { company_id } = getUserData();
            const formData = new FormData();
            const configurationFields = [
                { key: 'company_id', value: company_id },
                { key: 'document_number', value: requestCertificate.document_number },
                { key: 'email', value: requestCertificate.email },
                { key: 'social_reason', value: requestCertificate.social_reason },
                { key: 'signer_role', value: requestCertificate.signer_role },
                { key: KEY_PASSWORD_CERTIFICATE, value: requestCertificate.password_certificate },
                { key: 'certificate_policy_acceptation_date', value: requestCertificate.certificate_policy_acceptation_date },
                { key: 'test_set_id', value: requestCertificate.test_set_id },
            ];
            const billingAgentFields = [
                { key: 'identifier_organization', value: requestCertificate.identifier_organization },
                { key: 'economic_activity', value: requestCertificate.economic_activity },
                { key: 'city_code', value: requestCertificate.city_code },
                { key: 'city_name', value: requestCertificate.city_name },
                { key: 'postal_code', value: requestCertificate.postal_code },
                { key: 'state_name', value: requestCertificate.state_name },
                { key: 'state_code', value: requestCertificate.state_code },
                { key: 'address_line', value: requestCertificate.address_line },
                { key: 'company_name', value: requestCertificate.social_reason },
                { key: 'nit', value: requestCertificate.document_number },
                { key: 'responsibilities', value: requestCertificate.responsibilities },
                { key: 'tax_id', value: requestCertificate.tax_id },
                { key: 'tax_name', value: requestCertificate.tax_name },
                { key: 'telephone', value: requestCertificate.telephone },
                { key: 'email', value: requestCertificate.email },
                { key: 'identifier_organization_type', value: requestCertificate.document_name },
            ];

            configurationFields.forEach(({ key, value }) => {
                if ((value !== undefined && value !== null) || key === KEY_PASSWORD_CERTIFICATE) {
                    formData.append(`configuration[${key}]`, value ?? null);
                }
            });
            billingAgentFields.forEach(({ key, value }) => {
                if (value !== undefined && value !== null) {
                    formData.append(`billing_agent[${key}]`, value);
                }
            });

            if (SIGNER_ROLE.SUPPLIER === requestCertificate.signer_role && sendFile) {
                !lengthGreaterThanZero(Object.keys(file || {})) ? formData.append(FILE, file as any) : null;
            }

            const request = new FetchRequest(urls.electronic_invoice.config, formData);
            const { statusCode, ...response }: any = await apiPostElectronic(request);
            if (isCorrectResponse(statusCode)) await dispatch(getCertificateCompanyAction());

            return {
                statusCode,
                ...response,
                isCorrect: isCorrectResponse(statusCode),
            };
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getFilesCompanyAction = (type: string): ThunkAction<Promise<void>, RootState, unknown, IGetPrefixCompany> => {
    return async (dispatch: ThunkDispatch<RootState, any, parameterizationInvoice>): Promise<void> => {
        try {
            const { company_id } = getUserData();

            const request = new FetchRequest(urls.prefix.getDeleteFile(`${company_id}/${type}`));
            const { data }: any = await apiGetPrefix(request);
            data.type = type;
            data.type?.includes(TypeFile.LOGO_INVOICE) || data.type?.includes(TypeFile.LOGO_SUPPORT)
                ? dispatch(setFileLogo(data))
                : dispatch(setFileRut(data));
        } catch (error) {
            type === TypeFile.LOGO ? dispatch(setFileLogo(initialStateFile)) : dispatch(setFileRut(initialStateFile));
            dispatch(setError(String(error)));
        }
    };
};

export const deleteFilesCompanyAction = (type: TypeFile): ThunkAction<Promise<void>, RootState, unknown, IGetPrefixCompany> => {
    return async (dispatch: ThunkDispatch<RootState, any, parameterizationInvoice>): Promise<void> => {
        try {
            const { company_id } = getUserData();
            const request = new FetchRequest(urls.prefix.getDeleteFile(`${company_id}/${type}`));
            const { statusCode }: any = await apiDeletePrefix(request);
            if (type === TypeFile.LOGO_INVOICE || type === TypeFile.LOGO_SUPPORT)
                dispatch(dispatch(setFileLogo({ ...initialStateFile })));
            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getCertificateCompanyAction = (): ThunkAction<Promise<void>, RootState, unknown, IGetPrefixCompany> => {
    return async (dispatch: ThunkDispatch<RootState, any, parameterizationInvoice>): Promise<void> => {
        try {
            const { company_id } = getUserData();
            const request = new FetchRequest(urls.electronic_invoice.getCertificateCompanyAction(company_id));
            const { data, statusCode }: any = await apiGetElectronic(request);
            if (isCorrectResponse(statusCode)) {
                dispatch(setCertificateInfo(data));
            } else {
                dispatch(setCertificateInfo({ password_certificate: '' }));
            }
        } catch (error) {
            dispatch(setError(String(error)));
            dispatch(
                setCertificateInfo({
                    test_set_id: '',
                    password_certificate: '',
                })
            );
        }
    };
};

export const getSynchronizeAction = (
    documentNumber: string
): ThunkAction<Promise<void>, RootState, unknown, IGetPrefixCompany> => {
    return async (dispatch: ThunkDispatch<RootState, any, parameterizationInvoice>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.electronic_invoice.getSynchronize, {
                supplier_nit: documentNumber,
            });
            const { statusCode, data }: any = await apiPostPrefix(request);
            if (isCorrectResponse(statusCode)) {
                dispatch(getPrefixSynchronizeCompany(data));
            }
            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const updateTypePrefix = (
    dataPrefix: IGenericRecord
): ThunkAction<Promise<void>, RootState, unknown, IGetPrefixCompany> => {
    return async (dispatch: ThunkDispatch<RootState, any, parameterizationInvoice>): Promise<void> => {
        try {
            const url = urls.electronic_invoice.updateTypePrefix;
            const request = new FetchRequest(url, dataPrefix);
            const { statusCode, data }: any = await apiPostPrefix(request);
            if (isCorrectResponse(statusCode)) {
                dispatch(getPrefixSynchronizeCompany(data));
            }
            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const deletePrefixAction = (
    prefixId: string[]
): ThunkAction<Promise<IGenericRecord[]>, RootState, unknown, IGetPrefixCompany> => {
    return async (dispatch: ThunkDispatch<RootState, any, parameterizationInvoice>): Promise<IGenericRecord[]> => {
        try {
            const request = new FetchRequest(urls.prefix.deleteLogo((prefixId as unknown) as string));
            const { statusCode }: any = await apiDeletePrefix(request);
            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
            return [];
        }
    };
};

export const deleteMultiPrefixes = (
    prefixId: string[]
): ThunkAction<Promise<IGenericRecord[]>, RootState, unknown, IGetPrefixCompany> => {
    return async (dispatch: ThunkDispatch<RootState, any, parameterizationInvoice>): Promise<IGenericRecord[]> => {
        try {
            const request = new FetchRequest(urls.prefix.delete, prefixId);
            const { statusCode, data }: any = await apiDeletePrefix(request);
            return isCorrectResponse(statusCode) ? data : [];
        } catch (error) {
            dispatch(setError(String(error)));
            return [];
        }
    };
};

export const getInvoiceUtils = (
    utils = [FISCAL_RESPONSIBILITIES, FOREIGN_EXCHANGE, TAX_DETAILS]
): ThunkAction<Promise<void>, RootState, unknown, IGetPrefixCompany> => {
    return async (dispatch: ThunkDispatch<RootState, any, parameterizationInvoice>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.utils.dynamic_request, utils);
            const { data }: any = await apiPostUtils(request);
            if (data) dispatch(setUtils(formatUtils(data)));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const updateCompaniesCurrencies = (
    companiesForeignExchangeId: string,
    foreign_exchange_id: string
): ThunkAction<Promise<void>, RootState, null, any> => {
    return async (dispatch: ThunkDispatch<RootState, null, any>): Promise<void> => {
        try {
            const { id, company_id } = getUserData();
            const request = {
                user_id: id,
                company_id,
                foreign_exchange_id,
                is_active: false,
            };

            const fetchRequest = new FetchRequest(urls.company.updateCompanyCurrencies(companiesForeignExchangeId), request);

            const { statusCode }: any = await apiPutCompany(fetchRequest);
            if (isCorrectResponse(statusCode)) {
                dispatch(getInformationCompany());
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

/**
 * Method to send device data
 *
 * @param devices: IGenericRecord - device list
 * @returns Promise<void>
 *  */
export const postCompanyDevicesAction = (
    devices: IGenericRecord[]
): ThunkAction<Promise<void>, RootState, null, parameterizationInvoice> => {
    return async (dispatch: ThunkDispatch<RootState, null, parameterizationInvoice>): Promise<void> => {
        try {
            const { company_id } = getUserData();
            const infoDevices = {
                company_id,
                devices,
            };
            const request = new FetchRequest(urls.company.devices, infoDevices);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { statusCode, data }: any = await apiPostCompany(request);
            dispatch(getPrefixCompany(data));
            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

/**
 * Method to delete device data
 *
 * @param devices: IGenericRecord[] - device list
 *  */
export const deleteDevicesAction = (
    devices: IGenericRecord[]
): ThunkAction<Promise<void>, RootState, unknown, IGetPrefixCompany> => {
    return async (dispatch: ThunkDispatch<RootState, any, parameterizationInvoice>): Promise<void> => {
        try {
            const { company_id } = getUserData();
            const infoDevices = {
                company_id,
                ids: devices,
            };
            const request = new FetchRequest(urls.company.deleteDevices, infoDevices);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { statusCode }: any = await apiDeleteCompany(request);
            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

/**
 * This constant represents the key used to store the password certificate in the electronic configuration.
 */
const KEY_PASSWORD_CERTIFICATE = 'password_certificate';
