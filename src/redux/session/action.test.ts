import { setSession, failedSession, clearSession } from './actions';
import { ActionKeys } from './types';

test('It should set up setSession object', () => {
    const action = setSession('TOKEN', {
        email: 'testing@test.com',
        name: 'Testing',
        document_number: '1111111111',
        document_type: '825323f0-cafe-11eb-b8bc-0242ac130003',
        company_id: '1',
    });

    expect(action).toEqual({
        type: ActionKeys.SET_SESSION,
        accessToken: 'TOKEN',
        user: {
            email: 'testing@test.com',
            name: 'Testing',
            document_number: '1111111111',
            document_type: '825323f0-cafe-11eb-b8bc-0242ac130003',
            company_id: '1',
        },
    });
});

test('It should set up failedSession object', () => {
    const action = failedSession('Ingrese un email y/o contraseña válidos.');

    expect(action).toEqual({
        type: ActionKeys.FAILED_SESSION,
        error: 'Ingrese un email y/o contraseña válidos.',
    });
});

test('It should set up clearSession object', () => {
    const action = clearSession();

    expect(action).toEqual({
        type: ActionKeys.CLEAR_SESSION,
    });
});
