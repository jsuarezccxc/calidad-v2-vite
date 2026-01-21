import { failedModifications, setModifications } from './actions';
import { ActionKeys } from './type';

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

test('It should set up get last modifications users', () => {
    const action = setModifications(modifications);
    expect(action).toEqual({
        type: ActionKeys.SET_MODIFICATIONS,
        modifications,
    });
});

test('It should set up get last modifications users', () => {
    const action = failedModifications('Fallo interno del servidor.');
    expect(action).toEqual({
        type: ActionKeys.FAILED_MODIFICATIONS,
        error: 'Fallo interno del servidor.',
    });
});
