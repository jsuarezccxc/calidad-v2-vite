import { INIT_DATA } from '@constants/DashboardElectronicDocuments';
import { IDataDashboardElectronicDocuments } from '@models/DashboardElectronicDocuments';
import { ActionKeys, DashboardElectronicDocumentActions } from './types';

/**
 * This interface is structure state
 *
 * @typeParam data: IDataDashboardElectronicDocuments - Data dashboard
 * @typeParam error: string - Error dispatch
 */
interface IDashboardElectronicDocumentState {
    data: IDataDashboardElectronicDocuments;
    error: string;
}

/**
 * This const is init state
 */
const initState: IDashboardElectronicDocumentState = {
    data: { ...INIT_DATA },
    error: '',
};

export const reducer = (state = initState, action: DashboardElectronicDocumentActions): IDashboardElectronicDocumentState => {
    switch (action.type) {
        case ActionKeys.SET_DATA_DASHBOARD:
            return {
                ...state,
                data: action.data,
            };
        case ActionKeys.SET_ERROR:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};
