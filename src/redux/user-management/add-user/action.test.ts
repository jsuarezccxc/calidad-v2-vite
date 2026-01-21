import { ActionKeys } from './types';
import { addUser, errorAddUser } from './action';

test('It should set up add user object', () => {
    const action = addUser({
        email: 'test@test.co',
        name: 'test',
        password: '123456789',
        roles: [],
        accept_policy: false,
    });

    expect(action).toEqual({
        type: ActionKeys.ADD_USER,
        user: {
            email: 'test@test.co',
            name: 'test',
            password: '123456789',
            roles: [],
        },
    });
});

test('It should set up failed edit user', () => {
    const action = errorAddUser('Fallo interno del servidor.');

    expect(action).toEqual({
        type: ActionKeys.ERROR_ADD_USER,
        error: 'Fallo interno del servidor.',
    });
});
