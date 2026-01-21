import { reducer as updateUserReducer } from './reducer';
import { editUser, errorEditUser } from '@redux/user-management/edit-user/action';

test('It should set update user data', () => {
    const action = editUser({
        id: '1256687',
        email: 'test@test.co',
        name: 'test',
        roles: [],
    });
    const state = updateUserReducer({}, action);
    expect(state).toEqual({
        updateUser: {
            id: '1256687',
            email: 'test@test.co',
            name: 'test',
            roles: [],
        },
    });
});

test('It should failed membership', () => {
    const initialState = { error: '' };
    const action = errorEditUser('Fallo en el servidor.');
    const state = updateUserReducer(initialState, action);
    expect(state).toEqual({
        error: 'Fallo en el servidor.',
    });
});
