import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { RootState } from '@redux/rootReducer';

import { IFile } from '@components/input';

import { FetchRequest } from '@models/Request';
import { IGenericRecord } from '@models/GenericRecord';
import { ICreatePolitic } from '@models/Politics';
import { ICreatePurpose, IPolitics } from '@models/Politics';

import { urls } from '@api/urls';
import { apiBucketPost } from '@api/bucket';
import { apiPostFormData } from '@api/file';
import { apiGetPolitics, apiPostPolitics, apiDeletePolitics } from '@api/politics';

import { getUserData } from '@utils/User';
import { previewFile } from '@utils/DownloadFile';
import { isCorrectResponse } from '@utils/Response';

import { ZERO } from '@constants/UtilsConstants';

import { ActionKeys, IError, PoliticsActions, ISetStatusCode, IGetPolitics, ISetPoliticsPurposes } from './types';

export const setStatusCode = (statusCode: number | string): ISetStatusCode => ({
    type: ActionKeys.SET_STATUS_CODE,
    statusCode,
});

export const setPolitics = (politics: IPolitics[], isDelete: boolean): IGetPolitics => ({
    type: ActionKeys.GET_POLITICS,
    politics,
    isDelete,
});
export const setPoliticsPurposes = (politicsPurposes: IGenericRecord[]): ISetPoliticsPurposes => ({
    type: ActionKeys.GET_POLITICS_PURPOSES,
    politicsPurposes,
});

export const setError = (error: string): IError => ({
    type: ActionKeys.ERROR,
    error,
});

export const getPolitics = (isDelete = false): ThunkAction<Promise<void>, RootState, null, PoliticsActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, PoliticsActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.politic.politic);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetPolitics(request);
            dispatch(setPolitics(data, isDelete));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const uploadPolitics = (
    files: IFile,
    withSaveModal = false
): ThunkAction<Promise<void>, RootState, null, PoliticsActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, PoliticsActions>): Promise<void> => {
        try {
            const formData = new FormData();

            files.forEach(({ name, files }: IFile) => {
                if (files.length > ZERO) formData.append(name, files[ZERO]);
            });

            const request = new FetchRequest(urls.politic.politic, formData);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { statusCode }: any = await apiPostFormData(request);
            await dispatch(getPolitics());
            withSaveModal && dispatch(setStatusCode(statusCode));
            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const deletePolitic = (id: IGenericRecord): ThunkAction<Promise<void>, RootState, null, PoliticsActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, PoliticsActions>): Promise<void> => {
        try {
            const url = `${urls.politic.politic}/${id}`;
            const request = new FetchRequest(url);
            await apiDeletePolitics(request);
            await dispatch(getPolitics(true));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const createPolitic = (
    data: ICreatePolitic,
    isPreview = false
): ThunkAction<Promise<boolean>, RootState, null, PoliticsActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, PoliticsActions>): Promise<boolean> => {
        try {
            const { company_id } = getUserData();
            const url = isPreview ? urls.createPolitic : urls.updatePolitic;
            const request = new FetchRequest(url, {
                ...data,
                company_id,
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await apiBucketPost(request, true);
            if (isPreview) {
                previewFile(response, 'Política de privacidad y tratamiento de datos.pdf');
                return false;
            } else {
                await dispatch(getPolitics());
                return true;
            }
        } catch (error) {
            dispatch(setError(String(error)));
            return false;
        }
    };
};

export const getPoliticsPurposes = (): ThunkAction<Promise<void>, RootState, null, PoliticsActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, PoliticsActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.politic.privacyPurposes);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetPolitics(request);
            dispatch(setPoliticsPurposes(data));
        } catch (error) {
            dispatch(setError('Fallo interno del servidor'));
        }
    };
};

export const createUpdatePurpose = (purpose: ICreatePurpose): ThunkAction<Promise<void>, RootState, null, PoliticsActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, PoliticsActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.politic.privacyPurposes, purpose);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { statusCode }: any = await apiPostPolitics(request);
            if (isCorrectResponse(statusCode)) dispatch(getPoliticsPurposes());
        } catch (error) {
            dispatch(setError('Fallo interno del servidor'));
        }
    };
};

export const deletePurpose = (id: string): ThunkAction<Promise<void>, RootState, null, PoliticsActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, PoliticsActions>): Promise<void> => {
        try {
            const url = `${urls.politic.privacyPurposes}/${id}`;
            const request = new FetchRequest(url);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { statusCode }: any = await apiDeletePolitics(request);
            if (isCorrectResponse(statusCode)) dispatch(getPoliticsPurposes());
        } catch (error) {
            dispatch(setError('Fallo interno del servidor'));
        }
    };
};
