import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { urls } from '@api/urls';
import { apiPostFormData } from '@api/file';
import { apiGetUtils } from '@api/inventory';
import { FILE_INDEX } from '@constants/File';
import { IGenericRecord } from '@models/GenericRecord';
import { FetchRequest } from '@models/Request';
import { RootState } from '@redux/rootReducer';
import { getUserData } from '@utils/User';
import { isCorrectResponse } from '@utils/Response';
import {
    ActionKeys,
    ISetPersonalizedConsultingOptions,
    IError,
    PersonalizedConsultingActions,
    IGetPersonalizedConsultingOptions,
} from './types';

export const getPqrTypes = () => {
    return async (dispatch: ThunkDispatch<RootState, null, PersonalizedConsultingActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.personalizedConsulting.getPqrTypes);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await apiGetUtils(request);
            dispatch(setPqrTypes(response?.data));
            dispatch(setError(''));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getConsultingType = () => {
    return async (dispatch: ThunkDispatch<RootState, null, PersonalizedConsultingActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.personalizedConsulting.getConsultingType);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await apiGetUtils(request);
            dispatch(setConsultingType(response?.data));
            dispatch(setError(''));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const sendMailData = (
    data: IGenericRecord
): ThunkAction<Promise<boolean>, RootState, null, PersonalizedConsultingActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, PersonalizedConsultingActions>): Promise<boolean> => {
        try {
            const { id: user_id, company_id } = getUserData();
            const sedEmailDataUrl = urls.personalizedConsulting.sendMailData;

            const formData = new FormData();

            formData.append('user_id', user_id);
            formData.append('company_id', company_id);
            formData.append('resource', sedEmailDataUrl);
            formData.append('affair', data?.['data[affair]']);
            formData.append('type_name', data?.['data[type_name]']);
            formData.append('type', data?.['data[type]']);
            formData.append('full_name', data?.['data[full_name]']);
            formData.append('phone', data?.['data[phone]']);
            formData.append('email', data?.['data[email]']);
            formData.append('description', data?.['data[description]']);
            data?.file?.[FILE_INDEX] && formData.append('file', data?.file?.[FILE_INDEX]);

            const request = new FetchRequest(sedEmailDataUrl, formData);
            // eslint-disable-next-line
            const { statusCode }: any = await apiPostFormData(request);
            return isCorrectResponse(statusCode);
        } catch (error) {
            dispatch(setError(String(error)));
            return false;
        }
    };
};

export const setOption = (option: IGenericRecord): ISetPersonalizedConsultingOptions => ({
    type: ActionKeys.SET_PERSONALIZED_CONSULTING_OPTION,
    option,
});

export const setType = (option: IGenericRecord): ISetPersonalizedConsultingOptions => ({
    type: ActionKeys.SET_TYPE_PERSONALIZED_CONSULTING,
    option,
});

export const setError = (error: string): IError => ({
    type: ActionKeys.ERROR,
    error,
});

export const setPqrTypes = (type: IGenericRecord[]): IGetPersonalizedConsultingOptions => ({
    type: ActionKeys.GET_PQR_TYPE,
    data: type,
});

export const setConsultingType = (type: IGenericRecord[]): IGetPersonalizedConsultingOptions => ({
    type: ActionKeys.GET_CONSULTING_TYPE,
    data: type,
});
