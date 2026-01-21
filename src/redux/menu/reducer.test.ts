import { reducer as menuReducer } from './reducer';
import { showMenu } from './actions';

test('It should change state menu for showing in screen', () => {
    const initialState = { show: false };
    const action = showMenu();
    const state = menuReducer(initialState, action);
    expect(state).toEqual({ show: true });
});
