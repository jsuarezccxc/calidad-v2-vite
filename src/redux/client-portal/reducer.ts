import { IGenericRecord } from '@models/GenericRecord';
import { ActionKeys, ClientPortalActions } from './types';

const { GET_DYNAMIC_REQUEST, CLIENT_SELECTED, DELETE_ADDRESS, SET_STATUS_CODE, SET_ERROR } = ActionKeys;

interface IClientPortal {
    dynamicData: IGenericRecord;
    clientSelected: IGenericRecord;
    addressToDelete: string;
    statusCode: number;
    error: string;
}

const initialState: IClientPortal = {
    dynamicData: {},
    clientSelected: {},
    addressToDelete: '',
    statusCode: 0,
    error: '',
};

export const reducer = (state = initialState, action: ClientPortalActions): IClientPortal => {
    switch (action.type) {
        case GET_DYNAMIC_REQUEST:
            return {
                ...state,
                dynamicData: action.dynamicData,
            };
        case CLIENT_SELECTED:
            return {
                ...state,
                clientSelected: action.clientSelected,
            };
        case DELETE_ADDRESS:
            return {
                ...state,
                addressToDelete: action.addressToDelete,
            };
        case SET_STATUS_CODE:
            return {
                ...state,
                statusCode: action.statusCode,
            };
        case SET_ERROR:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};
