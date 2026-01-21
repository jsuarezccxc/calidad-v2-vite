/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { ActionKeys, ISetActiveMaintenance, ISetCloseModal, ISetShowModal, ISetValidated, MaintenanceActions } from './types';
import { urls } from '@api/urls';
import { HttpMethod, Request, ServiceType } from '@models/Request';
import { getUserData } from '@utils/User';
import { apiGetNotification, apiPostNotification } from '@api/notification';
import { isCorrectResponse } from '@utils/Response';
import { IGenericRecord } from '@models/GenericRecord';
import { extractDateAndTimes } from '@utils/Date';

export const setActiveMaintenance = (isActive: boolean) => (dispatch: Dispatch<ISetActiveMaintenance>): void => {
    dispatch({
        type: ActionKeys.SET_ACTIVE_MAINTENANCE,
        payload: isActive,
    });
};

export const setValidated = (validated: boolean) => (dispatch: Dispatch<ISetValidated>): void => {
    dispatch({
        type: ActionKeys.SET_VALIDATED,
        payload: validated,
    });
};

export const setShowModal = (data: IGenericRecord) => (dispatch: Dispatch<ISetShowModal>): void => {
    const { show_modal, initial_date, finish_date, maintenance_id } = data;
    const { date, startTime, endTime } = extractDateAndTimes(initial_date, finish_date);
    dispatch({
        type: ActionKeys.SET_SHOW_MODAL,
        showModal: !show_modal,
        dateMantenance: date,
        startTime: startTime,
        endTime: endTime,
        maintenanceId: maintenance_id

    });
};

export const setCloseMaintenanceModal = () => (dispatch: Dispatch<ISetCloseModal>): void => {
    dispatch({
        type: ActionKeys.SET_CLOSE_MODAL,
        showModal: false,
    });
};

export const getActiveMaintenance = () => {
    return async (dispatch: ThunkDispatch<RootState, null, MaintenanceActions>): Promise<void> => {
        try {
            const request = new Request(
                urls.notification.getMaintenance,
                HttpMethod.GET,
                ServiceType.NOTIFICATION,
            );
            const response: any = await apiGetNotification(request);
            if (isCorrectResponse(response?.statusCode)) {
                dispatch(setActiveMaintenance(response?.data));
                dispatch(setValidated(true));
            } else {
                dispatch(setActiveMaintenance(false));
            }
        } catch (error) {
            dispatch(setActiveMaintenance(false));
        }
    };
};

export const getHasSeenModal = (): any => {
    return async (dispatch: ThunkDispatch<RootState, null, MaintenanceActions>): Promise<void> => {
        try {
            const { id, company_id } = getUserData();
            const request = new Request(
                urls.notification.maintenanceHasSeenModal,
                HttpMethod.GET,
                ServiceType.NOTIFICATION,
                id,
                company_id
            );
            const response: any = await apiGetNotification(request);
            if (isCorrectResponse(response?.statusCode)) {
                dispatch(setShowModal(response?.data));
            } else {
                dispatch(setCloseMaintenanceModal());
            }
        } catch (error) {
            dispatch(setCloseMaintenanceModal());
        }
    };
};

export const updateViewModalMaintenance = (maintenanceId: string): any => {
    return async (dispatch: ThunkDispatch<RootState, null, MaintenanceActions>): Promise<void> => {
        try {
            const { id, company_id } = getUserData();
            const data = {
                company_id: company_id,
                maintenance_id: maintenanceId
            }
            const request = new Request(
                urls.notification.updateShowModalMaintenance,
                HttpMethod.POST,
                ServiceType.NOTIFICATION,
                id,
                company_id,
                data

            );
            await apiPostNotification(request);
            dispatch(setCloseMaintenanceModal());
        } catch (error) {
            dispatch(setCloseMaintenanceModal());
        }
    };
};

