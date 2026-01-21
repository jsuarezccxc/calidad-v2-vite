import { reducer as sessionReducer } from './reducer';
import { LoginConstants } from '@constants/Login';
import { clearSession, failedSession, setSession } from './actions';
import LocalStorage from '@utils/LocalStorage';

test('It should set session info', () => {
    const action = setSession('TOKEN', {
        id: '123456789',
        email: 'testing@test.com',
        name: 'Testing',
        document_number: '1111111111',
        document_type: '825323f0-cafe-11eb-b8bc-0242ac130003',
        company_id: '1',
    });

    const state = sessionReducer({ attempts: 0 }, action);

    expect(LocalStorage.get(LoginConstants.USER_TOKEN)).not.toBeNull();
    expect(LocalStorage.getObject(LoginConstants.USER_DATA)).not.toBeNull();
    expect(state).toEqual({
        attempts: 0,
        accessToken: 'TOKEN',
        user: {
            id: '123456789',
            email: 'testing@test.com',
            name: 'Testing',
            document_number: '1111111111',
            document_type: '825323f0-cafe-11eb-b8bc-0242ac130003',
            company_id: '1',
        },
    });
});

test('It should failed session', () => {
    const initialState = { attempts: 0, error: '' };
    const action = failedSession('Ingrese un email y/o contraseña válidos.');
    const state = sessionReducer(initialState, action);
    expect(state).toEqual({
        error: 'Ingrese un email y/o contraseña válidos.',
        attempts: 1,
    });
});

test('It should clear session', () => {
    const initialState = {
        attempts: 0,
        accessToken: 'TOKEN',
        user: {
            id: '123456789',
            email: 'testing@test.com',
            name: 'Testing',
            document_number: '1111111111',
            document_type: '825323f0-cafe-11eb-b8bc-0242ac130003',
            company_id: '1',
        },
    };

    expect(LocalStorage.get(LoginConstants.USER_TOKEN)).not.toBeNull();
    expect(LocalStorage.getObject(LoginConstants.USER_DATA)).not.toBeNull();

    const action = clearSession();
    const state = sessionReducer(initialState, action);

    expect(LocalStorage.get(LoginConstants.USER_TOKEN)).toBeUndefined();
    expect(LocalStorage.getObject(LoginConstants.USER_DATA)).toBeUndefined();
    expect(state).toEqual({ attempts: 0 });
});
