import { setDropdown } from './actions';
import { reducer as dropdownReducer } from './reducer';

test('It should change state dropdown when open in table', () => {
    const initialState = { dropdown: false };
    const action = setDropdown(true);
    const state = dropdownReducer(initialState, action);
    expect(state).toEqual({
        dropdown: true,
    });
});
