import { setProductCatalog, setError } from './actions';
import { ActionKeys } from './types';

test('It should set the product catalog', () => {
    const action = setProductCatalog([]);
    
    expect(action).toEqual({
        type: ActionKeys.SET_PRODUCT_CATALOG,
    });
});

test('It should set error if a requests fails', () => {
    const action = setError('The given data was invalid.');

    expect(action).toEqual({
        type: ActionKeys.SET_ERROR,
    });
});
