import { reducer as latestModifications } from './reducer';
import {
    failedModifications,
    setModifications,
} from '@redux/latest-modifications/actions';
import { IProducts } from '@redux/products/reducer';
import { errorEditUser } from '@redux/edit-user/action';
import { reducer as updateUserReducer } from '@redux/edit-user/reducer';

const initialState = {
    error: '',
    modifications: [],
};

const modifications = [
    {
        company_id: '129754fb-a3fb-39aa-9ffa-34300d50d947',
        date: 'Jul 19 2021 16:38:29',
        ip: '2354123123123',
        activity: 'delete',
        user: {
            id: 'ac171386-f7eb-411f-875d-8aa60cb4cc18',
            name: 'Test',
            email: 'test@test.co',
        },
        module: {
            id: 'e77a1cf6-3d8f-3d45-96ce-0132c3bb771f',
            name: 'run test',
        },
    },
];

test('It should set latest modifications users', () => {
    const action = setModifications(modifications);
    const state = latestModifications(initialState, action);
    expect(state).toEqual({
        ...state,
        modifications,
    });
});

test('It should failed latest modifications users', () => {
    const action = failedModifications('Fallo en el servidor.');
    const state = latestModifications(initialState, action);
    expect(state).toEqual({
        ...state,
    });
});
