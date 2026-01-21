import { IGenericRecord } from '@models/GenericRecord';
import { ActionKeys } from './types';
import {
    setProducts,
    setRemovedProducts,
    setCrudProducts,
    setError,
} from './actions';

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

test('it should set the products list', () => {
    const action = setProducts(products);

    expect(action).toEqual({
        type: ActionKeys.SET_PRODUCTS,
        products,
    });
});

test('it should set the new products list,after deleting one or more products', () => {
    const action = setRemovedProducts(products);

    expect(action).toEqual({
        type: ActionKeys.SET_REMOVED_PRODUCTS,
        products,
    });
});

test('it should set the crud products list', () => {
    const action = setCrudProducts(products);

    expect(action).toEqual({
        type: ActionKeys.SET_CRUD_PRODUCTS,
        crudProducts: products,
    });
});

test('it should set error if a requests fails', () => {
    const action = setError('The given data was invalid.');

    expect(action).toEqual({
        type: ActionKeys.SET_ERROR,
        error: 'The given data was invalid.',
    });
});
