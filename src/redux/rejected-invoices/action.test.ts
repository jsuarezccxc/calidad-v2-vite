import { setRejectedInvoices, setInvoice, setError } from './actions';
import { ActionKeys } from './types';

test('It should set the rejected invoices', () => {
    const action = setRejectedInvoices([]);

    expect(action).toEqual({
        type: ActionKeys.SET_REJECTED_INVOICES,
    });
});

test('It should set the current invoice', () => {
    const action = setInvoice({});

    expect(action).toEqual({
        type: ActionKeys.SET_INVOICE,
    });
});

test('It should set error if a requests fails', () => {
    const action = setError('The given data was invalid.');

    expect(action).toEqual({
        type: ActionKeys.SET_ERROR,
    });
});
