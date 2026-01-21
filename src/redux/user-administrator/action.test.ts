import { ActionKeys } from './types';
import { deleteUser, errorUser } from './action';

test('It should set up deleteUser object', () => {
    const action = deleteUser(['123456789']);

    expect(action).toEqual({
        type: ActionKeys.DELETE_USER,
        id: ['123456789'],
    });
});

test('It should set up errorUser object', () => {
    const action = errorUser('Intentelo de nuevo.');

    expect(action).toEqual({
        type: ActionKeys.ERROR_USER,
        error: 'Intentelo de nuevo.',
    });
});
