import { setParameterization, setNotifications, setError } from './actions';
import { ActionKeys } from './types';

export const parameterization = {
    id: 'b419848b-488d-4ad3-b078-07ceac1c0024',
    company_id: '573bc629-b8cd-36b3-8e7b-b79ca0bc0547',
    account_accreditation: true,
    physical_store_notification_time: '01:34 pm',
    warehouse_exit_notification_time: '05:24 pm',
    pending_notifications: false,
    created_at: 1632503843,
    updated_at: 1632503843,
};

export const parameterizationBuyAndSell = {
    id: 'b419848b-488d-4ad3-b078-07ceac1c0024',
    company_id: '573bc629-b8cd-36b3-8e7b-b79ca0bc0547',
    account_accreditation: false,
    buying_and_selling_checks: true,
    physical_store_notification_time: '01:34 pm',
    warehouse_exit_notification_time: '05:24 pm',
    pending_notifications: false,
    created_at: 1632503843,
    updated_at: 1632503843,
};

export const notifications = [
    {
        id: 'e38553a0-aae8-4efd-ad8a-3d5a4048d0a4',
        consecutive: 'NOT4',
        reference: '9d0a2c52-df05-3f43-be0d-6099737ebef8',
        date: 1632700800,
        type: 'PRODUCT',
        type_of_verification: 'Ventas mediante la página web',
        type_notification: {
            id: '699ba3ab-83c6-3f6f-87c2-5048e915c293',
            name: 'Ventas mediante la página web',
            description:
                'Tipo de notificación que se envía para informar de la finalización de una venta mediante el sitio web.',
            created_at: null,
            updated_at: null,
        },
        module_notification: {
            id: 'a157b0b8-b0bf-36b5-b1bb-10f82deeaec4',
            name: 'Control de inventario',
            description: '',
            created_at: null,
            updated_at: null,
        },
        state_notification: {
            id: 'c2e4151f-4713-35c6-9401-b306ed56bc89',
            name: 'Displayed',
            description: 'Notification displayed',
            created_at: null,
            updated_at: null,
        },
        created_at: 1632759999,
        updated_at: 1632759999,
    },
];

test('It should set the notification parameterization data', () => {
    const action = setParameterization(parameterization);

    expect(action).toEqual({
        type: ActionKeys.SET_PARAMETERIZATION,
    });
});

test('It should set the notifications', () => {
    const action = setNotifications(notifications);

    expect(action).toEqual({
        type: ActionKeys.SET_NOTIFICATIONS,
    });
});

test('It should set error if a requests fails', () => {
    const action = setError('The given data was invalid.');

    expect(action).toEqual({
        type: ActionKeys.SET_ERROR,
    });
});

test('It should set the notification parameterization data for buying and selling', () => {
    const action = setParameterization(parameterizationBuyAndSell);
    expect(action).toEqual({
        type: ActionKeys.SET_PARAMETERIZATION,
    });
});