import { reducer as userReducer } from './reducer';
import { showLoader, hideLoader } from './actions';

test('It should change state loader for showing in screen', () => {
    const initialState = { loader: false };
    const action = showLoader();
    const state = userReducer(initialState, action);
    expect(state).toEqual({ loader: true });
});

test('IT should change state loader for hiding in screen', () => {
    const initialState = { loader: true };
    const action = hideLoader();
    const state = userReducer(initialState, action);
    expect(state).toEqual({ loader: false });
});
