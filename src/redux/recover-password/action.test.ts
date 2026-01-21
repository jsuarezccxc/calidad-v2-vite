import {
    setDataForChangePassword,
    setRecoverPassword,
    failedRecoverPassword,
} from './actions';
import { ActionKeys } from './types';

test('It should set up setDataForChangePassword object', () => {
    const action = setDataForChangePassword(true);

    expect(action).toEqual({
        type: ActionKeys.CHANGE_PASSWORD,
        changePassword: true,
    });
});

test('It should set up setRecoverPassword object', () => {
    const action = setRecoverPassword(200);

    expect(action).toEqual({
        type: ActionKeys.RECOVER_PASSWORD,
        response: 200,
    });
});

test('It should set up failedRecoverPassword object', () => {
    const action = failedRecoverPassword("Token inválido");

    expect(action).toEqual({
        type: ActionKeys.FAILED,
        error: "Token inválido"
    });
});
