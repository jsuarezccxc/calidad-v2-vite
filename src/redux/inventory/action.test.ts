import { ActionKeys } from './types';
import {
	setCategories,
	setVariants,
	setWarehouseControlReport,
	setUnitMeasurements,
	setTaxes,
    setFailedError,
} from './actions';
import { categories, taxes, unit_measurements, variants, warehouse_report } from './reducer.test';

test('it should set categories list', () => {
    const action = setCategories(categories);

    expect(action).toEqual({
        type: ActionKeys.SET_CATEGORIES,
        categories: categories,
    });
});

test('it should set variants list', () => {
    const action = setVariants(variants);

    expect(action).toEqual({
        type: ActionKeys.SET_VARIANTS,
        variants: variants,
    });
});

test('it should set warehouse-config control report list', () => {
    const action = setWarehouseControlReport(warehouse_report);

    expect(action).toEqual({
        type: ActionKeys.SET_WAREHOUSE_CONTROL_REPORT,
        warehouse_report: warehouse_report,
    });
});

test('it should set unit measurements list', () => {
    const action = setUnitMeasurements(unit_measurements);

    expect(action).toEqual({
        type: ActionKeys.SET_UNIT_MEASUREMENTS,
        unit_measurements: unit_measurements,
    });
});

test('it should set taxes list', () => {
    const action = setTaxes(taxes);

    expect(action).toEqual({
        type: ActionKeys.SET_TAXES,
        taxes: taxes,
    });
});

test('it should set error if a requests fails', () => {
    const action = setFailedError('The given data was invalid.');

    expect(action).toEqual({
        type: ActionKeys.SET_FAILED_ERROR,
        error: 'The given data was invalid.',
    });
});
