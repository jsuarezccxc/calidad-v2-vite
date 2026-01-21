import { reducer as politicsReducer } from './reducer';
import { setPolitics, setStatusCode, setError } from './actions';
import { DATA_TEST_POLITICS } from '@constants/Politics';

test('It should change state politics', () => {
    const initialState = { politics: [], error: '', statusCode: '' };
    const action = setPolitics(DATA_TEST_POLITICS);

    const state = politicsReducer(initialState, action);
    expect(state).toEqual({
        data: DATA_TEST_POLITICS,
        error: '',
        statusCode: '',
    });
});

test('It should change state with new status code', () => {
    const initialState = { politics: [], error: '', statusCode: '' };
    const action = setStatusCode(200);
    const state = politicsReducer(initialState, action);
    expect(state).toEqual({
        statusCode: 200,
        politics: [],
        error: '',
    });
});

test('It should change state with error', () => {
    const initialState = { politics: [], error: '', statusCode: '' };
    const action = setError("Error response");
    const state = politicsReducer(initialState, action);
    expect(state).toEqual({
        statusCode: '',
        politics: [],
        error: 'Error response',
    });
});
