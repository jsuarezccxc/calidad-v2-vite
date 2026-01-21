import { reducer as warehousesReducer } from './reducer';
import { getDynamicRequest, setWarehouses, updateWarehouses } from './actions';

test('It should change state to data warehouses', () => {
    const initialState = { warehouses: [], error: '' };
    const action = setWarehouses([
        {
            id: '123456789',
            config_id: '755565',
            warehouses: [
                {
                    id: '894568',
                    name: 'Bodega 1',
                },
            ],
        },
    ]);
    const state = warehousesReducer(initialState, action);
    expect(state).toEqual({
        warehouses: [
            {
                id: '123456789',
                config_id: '755565',
                warehouses: [
                    {
                        id: '894568',
                        name: 'Bodega 1',
                    },
                ],
            },
        ],
        error: '',
    });
});

test('It should change state to update warehouses', () => {
    const initialState = { warehouses: [], updateWarehouse: [], error: '' };
    const action = updateWarehouses([
        {
            name: 'Bodega 02',
            config_id: '456987',
            address: 'Calle 103',
            city_name: 'Cartagena de Indias',
            department_name: 'Bolivar',
            country_name: 'Colombia',
        },
    ]);
    const state = warehousesReducer(initialState, action);
    expect(state).toEqual({
        updateWarehouse: [
            {
                name: 'Bodega 02',
                config_id: '456987',
                address: 'Calle 103',
                city_name: 'Cartagena de Indias',
                department_name: 'Bolivar',
                country_name: 'Colombia',
            },
        ],
        error: '',
    });
});

test('It should change state to delete warehouses', () => {
    const initialState = { warehouses: [], deleteWarehouse: [], error: '' };
    const action = updateWarehouses([
        {
            user_id: '1236540104',
            company_id: '1254796264',
        },
    ]);
    const state = warehousesReducer(initialState, action);
    expect(state).toEqual({
        deleteWarehouse: [
            {
                user_id: '1236540104',
                company_id: '1254796264',
            },
        ],
        error: '',
    });
});

test('It should change state to delete warehouses', () => {
    const initialState = { warehouses: [], getDynamicRequest: [], error: '' };
    const action = getDynamicRequest([ ]);
    const state = warehousesReducer(initialState, action);
    expect(state).toEqual({
        dynamicRequest:['departments', 'cities', 'countries'],
        error: '',
    });
});
