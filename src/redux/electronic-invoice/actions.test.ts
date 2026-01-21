import { setListIssuedDocument, setListDocumentsRequireAction, setError } from './actions';
import { ActionKeys } from './types';

test('It should set up list issued documents', () => {
    const action = setListIssuedDocument([]);

    expect(action).toEqual({
        type: ActionKeys.SET_LIST_ISSUED_DOCUMENT,
        issuedDocuments: [],
    });
});

test('It should set up list documents require action', () => {
    const action = setListDocumentsRequireAction([]);

    expect(action).toEqual({
        type: ActionKeys.SET_LIST_DOCUMENTS_REQUIRE_ACTION,
        documentsRequireAction: [],
    });
});

test('It should set up error', () => {
    const action = setError('Error response');

    expect(action).toEqual({
        type: ActionKeys.SET_ERROR,
        error: 'Error response',
    });
});
