import { deleteUser, errorUser } from '@redux/user-administrator/action';
import { reducer } from '@redux/user-administrator/reducer';
import { editUser } from "@redux/edit-user/action";
import {reducer as updateUserReducer} from "@redux/edit-user/reducer";

test('It should delete users', () => {
    const initialState = {};
    const action = deleteUser(['123456789']);
    const state = reducer(initialState, action);
    expect(state).toEqual({ id: ['123456789'] });
});

test('It should show error', () => {
    const initialState = {};
    const action = errorUser('Intentelo de nuevo');
    const state = reducer(initialState, action);
    expect(state).toEqual({ error: 'Intentelo de nuevo' });
});
