//--- Libraries ---//
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
//--- API ---//
import { urls } from '@api/urls';
import { apiPostBinnacleSimpleObject } from '@api/binnacle';
//--- Models ---//
import { FetchRequest } from '@models/Request';
//--- Redux ---//
import { RootState } from '@redux/rootReducer';
//--- Interfaces ---//
import { ActionKeys, IHistoryProps, IModificationInterface, ISetModificationHistory, ModificationHistoryActions } from './types';

export const setHistoryModification = (modificationsHistory: IModificationInterface): ISetModificationHistory => ({
    type: ActionKeys.SET_MODIFICATION_HISTORY,
    modificationsHistory,
});

export const getHistoryModifications = ({
    date,
    user_id,
    search
}: IHistoryProps): ThunkAction<Promise<void>, RootState, null, ModificationHistoryActions>  => {
    return async (dispatch: ThunkDispatch<RootState, null, ModificationHistoryActions>): Promise<void> => {
        const data = { user_id, date, search };
        if (!user_id) delete data.user_id;
        const modificationHistoryUrl = urls.modificationHistory;
        const requestBody = data;
        try {
            const request = new FetchRequest(modificationHistoryUrl, requestBody);
            // eslint-disable-next-line
            const response: any = await apiPostBinnacleSimpleObject(request);
            dispatch(setHistoryModification(response?.data));
            return response;
        } catch (error) {
            throw new Error(`${error} Endpoint error`);
        }
    };
};
