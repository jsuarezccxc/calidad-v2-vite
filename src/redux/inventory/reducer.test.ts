import { reducer as productsReducer, IInventoryState } from './reducer';
import { setCategories, setVariants, setWarehouseControlReport, setUnitMeasurements, setTaxes, setFailedError } from './actions';

const initialState: IInventoryState = {
    categories: [],
	variants: [],
	warehouse_report: [],
	unit_measurements: [],
	taxes: [],
	build_product: null,
    error: '',
};

export const categories = [
    {
        id: '81ecc51f-d794-4f5f-a322-c3aaab156382',
        name: 'Talla',
        company_id: 'b975f3be-7a89-36f9-a8b6-ee6874b88030',
        product_types: [
            {
                id: '15f6601d-5d38-47dd-a2ee-eeb6710635a5',
                name: 'Camiseta',
                category_id: '81ecc51f-d794-4f5f-a322-c3aaab156382',
            },
        ],
    },
    {
        id: '632b3ca4-25bd-4027-ad7f-fe44f2ba6af0',
        name: 'Mascota',
        company_id: 'b975f3be-7a89-36f9-a8b6-ee6874b88030',
        product_types: [],
    },
];

export const variants = [
    {
        id: '7084b9ac-7336-4702-a1ae-2012adffef33',
        name: 'Color',
        product_type_id: '15f6601d-5d38-47dd-a2ee-eeb6710635a5',
        variant_details: [
            {
                id: 'd1deda22-48d9-44a0-a0b9-bd9726674642',
                name: 'Talla',
                variant_id: 'c224b280-3847-4f25-afd2-5df628350f64',
            },
        ],
    },
];

export const unit_measurements = [
	{
		id: 'e1305740-b0b0-44a6-a27b-08d4b363fe11',
		name: 'Kgs',
		description: 'Kilogramos.',
		created_at: null,
		updated_at: null
	},
	{
		id: 'a1405740-b0b0-45a6-a21b-88d4b363fe11',
		name: 'Unds',
		description: 'Unidad.',
		created_at: null,
		updated_at: null
	}
];

export const taxes = [
	{
		id: 'daa83c3f-077d-49c8-857e-e6e358d29fc0',
		name: '19%',
		description: '',
		percentage: 19,
		created_at: null,
		updated_at: null
	},
	{
		id: 'd327ade0-a53c-41c6-a4ef-bdfb62a7258d',
		name: '5%',
		description: '',
		percentage: 5,
		created_at: null,
		updated_at: null
	},
	{
		id: '0b9849d0-c505-4a53-a4fa-af948dc4de02',
		name: 'Excluido',
		description: '',
		percentage: 0,
		created_at: null,
		updated_at: null
	},
	{
		id: 'fa7450cd-7d8e-477c-a5fa-adc10940d6ac',
		name: 'Excento',
		description: '',
		percentage: 0,
		created_at: null,
		updated_at: null
	},
	{
		id: '58173c3c-2d0c-43a9-957d-1223cd9e699f',
		name: 'No grabado',
		description: '',
		percentage: 0,
		created_at: null,
		updated_at: null
	}
];

export const warehouse_report = [
    {
		"id": "a03cf03e-d475-3c44-ab3f-9c67f7afc331",
		"name": "Letha Will",
		"products": [
			{
			"id": "50e05656-eb98-45d0-bb11-5ed63505d462",
			"sku": "Joshua Vandervort",
			"initial_inventory": 9400,
			"initial_unit_cost": 7050000,
			"unit_purchases": 9400,
			"unit_purchases_cost": 7050000,
			"unit_sales": 16417,
			"unit_cost_in_sales": 12312750,
			"units_available": -7017,
			"unit_cost_units_available": -5262750,
			"distribution_percentage": 66.0983421250942
			},
		],
	}
];

test('It should set categories list', () => {
    const action = setCategories(categories);
    const state = productsReducer(initialState, action);
    expect(state).toEqual({
        ...state,
        categories: categories,
        error: '',
    });
});

test('It should set variants list', () => {
    const action = setVariants(variants);
    const state = productsReducer(initialState, action);
    expect(state).toEqual({
        ...state,
        variants: variants,
        error: '',
    });
});

test('It should set warehouse-config control report list', () => {
    const action = setWarehouseControlReport(warehouse_report);
    const state = productsReducer(initialState, action);
    expect(state).toEqual({
        ...state,
        warehouse_report: warehouse_report,
        error: '',
    });
});

test('It should set unit measurements list', () => {
    const action = setUnitMeasurements(unit_measurements);
    const state = productsReducer(initialState, action);
    expect(state).toEqual({
        ...state,
        unit_measurements: unit_measurements,
        error: '',
    });
});

test('It should set taxes list', () => {
    const action = setTaxes(taxes);
    const state = productsReducer(initialState, action);
    expect(state).toEqual({
        ...state,
        taxes: taxes,
        error: '',
    });
});

test('It should set error', () => {
    const action = setFailedError('The given data was invalid.');
    const state = productsReducer(initialState, action);
    expect(state).toEqual({ ...state, error: 'The given data was invalid.' });
});
