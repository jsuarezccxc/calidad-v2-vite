export enum ActionKeys {
    SET_ACTIVE_MAINTENANCE = 'SET_ACTIVE_MAINTENANCE',
    SET_VALIDATED = 'SET_VALIDATED',
    SET_SHOW_MODAL = 'SET_SHOW_MODAL',
    SET_CLOSE_MODAL = 'SET_CLOSE_MODAL'
}

export interface ISetActiveMaintenance {
    type: ActionKeys.SET_ACTIVE_MAINTENANCE;
    payload: boolean;
}

export interface ISetValidated {
    type: ActionKeys.SET_VALIDATED;
    payload: boolean;
}

export interface ISetShowModal {
    type: ActionKeys.SET_SHOW_MODAL;
    showModal: boolean;
    dateMantenance: string;
    startTime: string;
    endTime: string;
    maintenanceId: string;
}

export interface ISetCloseModal {
    type: ActionKeys.SET_CLOSE_MODAL;
    showModal: boolean;
}

export type MaintenanceActions = ISetActiveMaintenance | ISetValidated | ISetShowModal | ISetCloseModal;
