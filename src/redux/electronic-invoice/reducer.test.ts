import { reducer as electronicInvoiceReducer } from './reducer';
import { setListIssuedDocument, setListDocumentsRequireAction, setError, setSelectedDocument } from './actions';

const data = [
    {
        id: '8e293b36-e01a-34c4-88e2-ef4568b7d404',
        invoice_type: 'PURCHASE_ORDER',
        number: 'Rhett Schowalter',
        number_purchase_order: 8982673,
        prefix: 357341,
        date: 1638230400,
        date_purchase_order: 1638230400,
        associated_document: 'N/A',
        purchasing_manager: 'Mr. Gonzalo Streich I',
        person_id: '73ebda01-6bc8-3f23-8e03-83d2abbfa5f9',
        client_name: 'Nedra Kunze',
        client_email: 'avandervort@example.org',
        total_sale: 400.36901,
        total_invoice: 405606.21214858,
        total: 3771185.5,
        DIAN_response: 'Verificar de donde sacar este campo',
        customer_response:
            'At provident delectus dolor ipsum non hic in. Blanditiis officia similique voluptatibus illo aliquid nostrum. Dolorem aspernatur deserunt nihil non aut voluptas.',
        rejected_reason: 'Validar este campo',
        sale_chanel: 'SOCIAL_MEDIA',
        method_upload: 'Validar el valor de este campo',
    },
];

test('It should change state to list issued documents', () => {
    const initialState = { issuedDocuments: [], documentsRequireAction: [], document: {}, error: '' };
    const action = setListIssuedDocument(data);

    const state = electronicInvoiceReducer(initialState, action);
    expect(state).toEqual({
        issuedDocuments: data,
        error: '',
    });
});

test('It should change state to list documents required', () => {
    const initialState = { issuedDocuments: [], documentsRequireAction: [], document: {}, error: '' };
    const action = setListDocumentsRequireAction(data);

    const state = electronicInvoiceReducer(initialState, action);
    expect(state).toEqual({
        documentsRequireAction: data,
        error: '',
    });
});

test('It should change state to selected document from list', () => {
    const initialState = { issuedDocuments: [], documentsRequireAction: [], document: {}, error: '' };
    const action = setSelectedDocument(data[0]);

    const state = electronicInvoiceReducer(initialState, action);
    expect(state).toEqual({
        document: data[0],
        error: '',
    });
});

test('It should change state with error', () => {
    const initialState = { issuedDocuments: [], documentsRequireAction: [], document: {}, error: '' };
    const action = setError('Error response');
    const state = electronicInvoiceReducer(initialState, action);
    expect(state).toEqual({
        issuedDocuments: [],
        error: 'Error response',
    });
});
