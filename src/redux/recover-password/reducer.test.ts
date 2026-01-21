import { reducer as recoverPasswordReducer } from './reducer';
import {
    setRecoverPassword,
    setDataForChangePassword,
    failedRecoverPassword,
} from './actions';

test('It should set recover password code response', () => {
    const action = setRecoverPassword(200);
    const state = recoverPasswordReducer({}, action);

    expect(state).toEqual({
        response: 200,
    });
});

test('It should dispatch a change password action', () => {
    const action = setDataForChangePassword(true);
    const state = recoverPasswordReducer({}, action);
    expect(state).toEqual({
        changePassword: true,
    });
});

test('It should failed recover or change password action', () => {
    const initialState = {
        error: '',
    };

    const action = failedRecoverPassword('*Token inválido');
    const state = recoverPasswordReducer(initialState, action);

    expect(state).toEqual({ error: '*Token inválido', response: 422 });
});
