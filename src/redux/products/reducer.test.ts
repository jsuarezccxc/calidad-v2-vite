import { reducer as productsReducer } from './reducer';
import { IGenericRecord } from '@models/GenericRecord';
import { IProducts } from './reducer';
import {
    setProducts,
    setCrudProducts,
    setRemovedProducts,
    setError,
} from './actions';

const initialState: IProducts = {
    error: '',
    products: [],
    crudProducts: [],
};

const products: IGenericRecord[] = [
    {
        id: '3f7091b0-fe41-46e7-b148-ae41f2f7bae6',
        company_id: 'e492a89a-617c-387c-ba94-6653367a63f8',
        measurement_unit: 46,
        unitary_value: 3002,
        unitary_cost: 4,
        reference: 'Camisa',
    },
    {
        id: '6f7091b0-fe41-46e7-b148-ae41f2f7bae6',
        company_id: 'e492a89a-617c-387c-ba94-6653367a63f8',
        measurement_unit: 46,
        unitary_value: 3002,
        unitary_cost: 4,
        reference: 'Pantalón',
    },
];

test('It should set the products list', () => {
    const action = setProducts(products);
    const state = productsReducer(initialState, action);
    expect(state).toEqual({
        ...state,
        products,
        error: '',
    });
});

test('It should set the new products list, after deleting one or more products', () => {
    const action = setRemovedProducts(products);
    const state = productsReducer(initialState, action);
    expect(state).toEqual({
        ...state,
        products: products,
        error: '',
    });
});

test('It should set the crud products list', () => {
    const action = setCrudProducts(products);
    const state = productsReducer(initialState, action);
    expect(state).toEqual({
        ...state,
        crudProducts: products,
        error: '',
    });
});

test('It should set error', () => {
    const action = setError('The given data was invalid.');
    const state = productsReducer(initialState, action);
    expect(state).toEqual({ ...state, error: 'The given data was invalid.' });
});
