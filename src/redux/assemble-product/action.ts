/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import {
    ActionKeys,
    AssembleProductActions,
    IErrorMassiveUpload,
    ISetError,
    ISetErrorMassiveUpload,
    ISetMassiveUpload,
} from './types';
import { FetchRequest } from '@models/Request';
import { IGenericRecord } from '@models/GenericRecord';
import { urls } from '@api/urls';
import { apiUploadRejectSupport } from '@api/invoice';
import { getUserData } from '@utils/User';
import { createFormData } from '@utils/FormData';
import { isCorrectResponse } from '@utils/Response';
import { apiInventoryFiles } from '@api/inventory';
import { PRODUCT_KEY, PRODUCTS_KEY } from '@constants/Product';
import { FILE } from '@constants/File';

export const setDataMassiveUpload = (data: IGenericRecord[]): ISetMassiveUpload => ({
    type: ActionKeys.SET_DATA_MASSIVE_UPLOAD,
    payload: data,
});

export const setError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const setErrorMassiveUpload = (payload: IErrorMassiveUpload[]): ISetErrorMassiveUpload => ({
    type: ActionKeys.SET_ERROR_MASSIVE_UPLOAD,
    payload,
});

export const postMassiveUpload = (xls: Blob): ThunkAction<Promise<void>, RootState, null, AssembleProductActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, AssembleProductActions>): Promise<void> => {
        try {
            const formData = createFormData([{ key: FILE, value: xls }]);
            const request = new FetchRequest(urls.products.uploadFile, formData);
            const { data, statusCode, errors = [] }: any = await apiInventoryFiles(request);
            if (isCorrectResponse(statusCode)) dispatch(setDataMassiveUpload(data));

            dispatch(setErrorMassiveUpload(errors));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postProduct = (
    product: IGenericRecord,
    images: IGenericRecord[]
): ThunkAction<Promise<void>, RootState, null, AssembleProductActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, AssembleProductActions>): Promise<void> => {
        try {
            const { company_id } = getUserData();

            const formData = createFormData([
                { key: PRODUCT_KEY, value: JSON.stringify({ ...product, company_id }) },
                ...images.map((image: IGenericRecord | any, index: number) => ({ key: `image${index}`, value: image })),
            ]);
            const request = new FetchRequest(urls.products.postProduct, formData);
            const { data, statusCode }: any = await apiUploadRejectSupport(request);
            if (isCorrectResponse(statusCode)) dispatch(setDataMassiveUpload(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postMassiveProducts = (
    products: IGenericRecord,
    images: IGenericRecord[] = []
): ThunkAction<Promise<boolean>, RootState, null, AssembleProductActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, AssembleProductActions>): Promise<boolean> => {
        try {
            const formData = createFormData([
                { key: PRODUCTS_KEY, value: JSON.stringify(products) },
                ...images.map((image: any, index: number) => ({ key: `image${index}`, value: image })),
            ]);
            const request = new FetchRequest(urls.products.postMassiveProducts, formData);
            await apiUploadRejectSupport(request);
            return true;
        } catch (error) {
            dispatch(setError(String(error)));
            return false;
        }
    };
};
