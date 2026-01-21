import { reducer as invoiceReducer } from './reducer';
import { setRejectedInvoices, setInvoice, setError } from './actions';

const initialState = {
    invoices: [],
    invoice: {},
    error: '',
};

test('It should set the rejected invoices', () => {
    const action = setRejectedInvoices([]);
    const state = invoiceReducer(initialState, action);

    expect(state).toEqual({
        ...state,
        invoices: [],
    });
});

test('It should set the current invoice', () => {
    const action = setInvoice({});
    const state = invoiceReducer(initialState, action);

    expect(state).toEqual({
        ...state,
        invoice: {},
    });
});

test('It should set error', () => {
    const action = setError('The given data was invalid.');
    const state = invoiceReducer(initialState, action);

    expect(state).toEqual({ ...state, error: 'The given data was invalid.' });
});
