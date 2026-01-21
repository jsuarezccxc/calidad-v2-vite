import { ActionKeys } from './types';
import { editUser, errorEditUser } from './action';

test('It should set up editUser object', () => {
    const action = editUser({
        id: '1256687',
        email: 'test@test.co',
        name: 'test',
        roles: [],
    });

    expect(action).toEqual({
        type: ActionKeys.EDIT_USER,
        updateUser: {
            id: '1256687',
            email: 'test@test.co',
            name: 'test',
            roles: [],
        },
    });
});

test('It should set up failed edit user', () => {
    const action = errorEditUser('Fallo interno del servidor.');

    expect(action).toEqual({
        type: ActionKeys.ERROR_EDIT_USER,
        error: 'Fallo interno del servidor.',
    });
});
