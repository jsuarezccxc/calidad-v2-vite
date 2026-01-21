import { reducer as userReducer } from './reducer';
import { setHasBlog, setRows, setError } from './actions';

const initialState = {
    website: [],
    hasBlog: true,
    rows: [],
    ids: {},
    homeSections: [],
    aboutUsSections: [],
    contactUsSections: [],
    pages: [],
    list_accreditation: [],
    error: '',
    statusTemplate: 0,
    bucket: '',
    title: '',
};

test('It should change state to show blog option', () => {
    const action = setHasBlog(true);
    const state = userReducer(initialState, action);
    expect(state).toEqual({ ...state, has_blog: true });
});

test('It should set the website rows', () => {
    const action = setRows([]);
    const state = userReducer(initialState, action);
    expect(state).toEqual({ ...state, rows: [] });
});

test('It should change state error', () => {
    const action = setError('Failed response error');
    const state = userReducer(initialState, action);
    expect(state).toEqual({ ...state, error: 'Failed response error' });
});
