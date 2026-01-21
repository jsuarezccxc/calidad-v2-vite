import { reducer as suppliersReducer } from './reducer';
import { setError, setSuppliers, setSupplierHistory } from './actions';
import { IGenericRecord } from '@models/GenericRecord';

const suppliers: IGenericRecord[] = [
    {
        id: '31b242b1-3f57-4176-8855-6e264021a714',
        name: 'Apple',
        buy_responsible: 'b975f3be-7a89-36f9-a8b6-ee6874b89030',
        person_id: 'd834ce81-cc15-4ba4-ac27-7f32735a8345',
        taxpayer: '123',
        qualification_id: 'b975f3be-7a89-46f9-a8b6-ee6874b89030',
        person: {
            id: 'd834ce81-cc15-4ba4-ac27-7f32735a8345',
            company_id: '129754fb-a3fb-39aa-9ffa-34300d50d947',
            user_type_id: 'b975f3be-7c89-36f9-a8b6-ee6874b88030',
            document_type: 'b975f3be-7d89-36f9-a8b6-ee6874b88030',
            document_number: '123456789',
            address: 'avenida siempre viva 123',
            email: 'prueba@pruebba.com',
            phone: '1234567',
            cellphone: '1234567',
            document_name: 'C.C',
        },
    },
    {
        id: '9a204f8b-1ed8-445e-a699-3502589dbec4',
        name: 'Lg',
        buy_responsible: 'b975f3be-7a89-36f9-a8b6-ee6874b89030',
        person_id: 'ebe1e84a-9659-48bd-8cd4-a3c4b3064a06',
        taxpayer: '1234',
        qualification_id: 'b975f3be-7a89-46f9-a8b6-ee6874b89030',
        person: {
            id: 'ebe1e84a-9659-48bd-8cd4-a3c4b3064a06',
            company_id: '129754fb-a3fb-39aa-9ffa-34300d50d947',
            user_type_id: 'b975f3be-7c89-36f9-a8b6-ee6874b88030',
            document_type: 'b975f3be-7d89-36f9-a8b6-ee6874b88030',
            document_number: '123456789',
            address: 'avenida siempre viva 123',
            email: 'prueba2@pruebba.com',
            phone: '12345678',
            cellphone: '12345678',
            document_name: 'C.C',
        },
    },
];

const initialState = {
    suppliers: [],
    supplierHistory: [],
    invoice: {},
    error: { email: '', document_number: '' },
};

test('It should set a suppliers list', () => {
    const action = setSuppliers(suppliers);
    const state = suppliersReducer(initialState, action);
    expect(state).toEqual({ ...state, suppliers, error: '' });
});

test('It should set a suppliers history list', () => {
    const action = setSupplierHistory([]);
    const state = suppliersReducer(initialState, action);
    expect(state).toEqual({ ...state, supplierHistory: [], error: '' });
});

test('It should set a error', () => {
    const action = setError({ error: 'The given data was invalid.' });
    const state = suppliersReducer(initialState, action);
    expect(state).toEqual({ ...state, error: { error: 'The given data was invalid.' } });
});
