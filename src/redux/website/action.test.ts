import { ActionKeys } from './types';
import { setHasBlog, setRows, setError } from './actions';

test('It should set up change state to show blog option', () => {
    const action = setHasBlog(true);

    expect(action).toEqual({
        type: ActionKeys.SET_HAS_BLOG,
        with_blog: true,
    });
});

test('It should set the website rows', () => {
    const action = setRows([]);

    expect(action).toEqual({
        type: ActionKeys.SET_ROWS,
        rows: [],
    });
});

test('It should set up error response website', () => {
    const action = setError('Failed response error');

    expect(action).toEqual({
        type: ActionKeys.SET_ERROR,
        error: 'Failed response error',
    });
});
