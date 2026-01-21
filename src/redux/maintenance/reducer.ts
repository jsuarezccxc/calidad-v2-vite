import { ActionKeys, MaintenanceActions } from './types';

export interface IMaintenanceState {
    validated: boolean;
    activeMaintenance: boolean;
    showModal: boolean;
    maintenanceId?: string;
    dateMantenance?: string;
    startTime?: string;
    endTime?: string;
}

const initialState: IMaintenanceState = {
    validated: false,
    activeMaintenance: false,
    showModal: false,

};

export const reducer = (state = initialState, action: MaintenanceActions): IMaintenanceState => {
    switch (action.type) {
        case ActionKeys.SET_ACTIVE_MAINTENANCE: {
            return {
                ...state,
                activeMaintenance: action.payload,
            };
        }
        case ActionKeys.SET_VALIDATED: {
            return {
                ...state,
                validated: action.payload,
            };
        }
        case ActionKeys.SET_SHOW_MODAL: {
            return {
                ...state,
                showModal: action.showModal,
                dateMantenance: action.dateMantenance,
                startTime: action.startTime,
                endTime: action.endTime,
                maintenanceId: action.maintenanceId
            };
        }
        case ActionKeys.SET_CLOSE_MODAL: {
            return {
                ...state,
                showModal: action.showModal,
                dateMantenance: '',
                startTime: '',
                endTime: '',
                maintenanceId: ''
            }
        }
        default:
            return state;
    }
};
