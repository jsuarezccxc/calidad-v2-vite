import { setPolitics, setStatusCode, setError } from './actions';
import { ActionKeys } from './types';
import { DATA_TEST_POLITICS } from '@constants/Politics';

test('It should set up politics data', () => {
    const action = setPolitics(DATA_TEST_POLITICS);

    expect(action).toEqual({
        type: ActionKeys.GET_POLITICS,
        data: DATA_TEST_POLITICS,
    });
});

test('It should set up response status', () => {
    const action = setStatusCode(200);

    expect(action).toEqual({
        type: ActionKeys.SET_STATUS_CODE,
        response: 200,
    });
});

test('It should set up error', () => {
    const action = setError('Error response');

    expect(action).toEqual({
        type: ActionKeys.ERROR,
        error: 'Error response',
    });
});
