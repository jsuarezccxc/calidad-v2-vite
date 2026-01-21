import { createWarehouses, deleteWarehouse, getDynamicData, setWarehouses, updateWarehouses } from './actions';
import { ActionKeys } from './types';

test('It should set up data warehouses', () => {
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

    expect(action).toEqual({
        type: ActionKeys.GET_WAREHOUSES,
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
    });
});

test('It should create warehouse', () => {
    const action = createWarehouses([
        {
            name: 'Bodega 01',
            config_id: '456987',
            address: 'Calle 104',
            city_name: 'Bogota',
            department_name: 'Cundinamarca',
            country_name: 'Colombia',
        },
    ]);

    expect(action).toEqual({
        type: ActionKeys.CREATE_WAREHOUSE,
        createWarehouses: [
            {
                name: 'Bodega 01',
                config_id: '456987',
                address: 'Calle 104',
                city_name: 'Bogota',
                department_name: 'Cundinamarca',
                country_name: 'Colombia',
            },
        ],
    });
});

test('It should update warehouse', () => {
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

    expect(action).toEqual({
        type: ActionKeys.UPDATE_WAREHOUSE,
        updateWarehouses: [
            {
                name: 'Bodega 01',
                config_id: '456987',
                address: 'Calle 104',
                city_name: 'Bogota',
                department_name: 'Cundinamarca',
                country_name: 'Colombia',
            },
        ],
    });
});

test('It should delete warehouse', () => {
    const action = deleteWarehouse([
        {
            user_id: '1236540104',
            company_id: '1254796264',
        },
    ]);

    expect(action).toEqual({
        type: ActionKeys.DELETE_WAREHOUSE,
        deleteWarehouses: [
            {
                user_id: '1236540104',
                company_id: '1254796264',
            },
        ],
    });
});

test('It should delete warehouse', () => {
    const action = getDynamicData(['departments', 'cities', 'countries']);

    expect(action).toEqual({
        type: ActionKeys.GET_DYNAMIC_REQUEST,
        getDynamicRequest: ['departments', 'cities', 'countries'],
    });
});
