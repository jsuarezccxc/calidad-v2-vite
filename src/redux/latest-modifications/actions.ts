import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import FileSaver from 'file-saver';
import {
    ActionKeys,
    IFailedModifications,
    ISetModifications,
    LatestModificationsActions,
} from '@redux/latest-modifications/type';
import { RootState } from '@redux/rootReducer';
import { FetchRequest } from '@models/Request';
import type { IGenericRecord } from '@models/GenericRecord';
import { IFileRequest, IFileType } from '@models/File';
import { urls } from '@api/urls';
import { apiFile } from '@api/file';
import { fileType } from '@utils/File';
import { apiPostBinnacle } from '@api/binnacle';
import { getUserData } from '@utils/User';

export const setModifications = (modifications: IGenericRecord[]): ISetModifications => ({
    type: ActionKeys.SET_MODIFICATIONS,
    modifications,
});

export const failedModifications = (error: string): IFailedModifications => ({
    type: ActionKeys.FAILED_MODIFICATIONS,
    error,
});

export const getLatestModifications = (
    dates: IGenericRecord
): ThunkAction<Promise<void>, RootState, unknown, LatestModificationsActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, LatestModificationsActions>): Promise<void> => {
        try {
            const { company_id } = getUserData();

            const request = new FetchRequest(urls.internalActivitiesModifications, { company_id, ...dates });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiPostBinnacle(request);
            dispatch(setModifications(data.last_modifications));
        } catch (error) {
            dispatch(failedModifications('Fallo interno del servidor'));
        }
    };
};

export const getFile = (dataFile: IFileRequest): ThunkAction<Promise<void>, RootState, null, LatestModificationsActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, LatestModificationsActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.getFile, dataFile);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await apiFile(request);
            const blob = new Blob([response], {
                type: fileType[dataFile.type as keyof IFileType],
            });
            FileSaver.saveAs(blob, `histórico de modificaciones.${dataFile.type}`);
        } catch (error) {
            dispatch(failedModifications('Inténtelo más tarde'));
        }
    };
};
