import { reducer as productCatalogReducer } from './reducer';
import { setProductCatalog, setError } from './actions';

const initialState = {
    error: '',
    catalog: [],
};

test('It should set the product catalog', () => {
    const action = setProductCatalog([]);
    const state = productCatalogReducer(initialState, action);

    expect(state).toEqual({
        ...state,
        catalog: [],
    });
});

test('It should set error', () => {
    const action = setError('The given data was invalid.');
    const state = productCatalogReducer(initialState, action);

    expect(state).toEqual({ ...state, error: 'The given data was invalid.' });
});
