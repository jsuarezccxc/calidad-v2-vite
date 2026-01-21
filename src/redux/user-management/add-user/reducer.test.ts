import { addUser, errorAddUser } from '@redux/user-management/add-user/action';
import { reducer as addUserReducer } from './reducer';

test('It should set add user data', () => {
    const action = addUser({
        email: 'test@test.co',
        name: 'test',
        password: '123456789',
        roles: [],
    });
    const state = addUserReducer({}, action);
    expect(state).toEqual({
        user: {
            email: 'test@test.co',
            name: 'test',
            password: '123456789',
            roles: [],
        },
    });
});

test('It should failed membership', () => {
    const initialState = { error: '' };
    const action = errorAddUser('Fallo en el servidor.');
    const state = addUserReducer(initialState, action);
    expect(state).toEqual({
        error: 'Fallo en el servidor.',
    });
});
