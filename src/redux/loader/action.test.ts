import { showLoader, hideLoader } from './actions';
import { ActionKeys } from './types';


test('It should set up show loader object', () => {
    const action = showLoader();

    expect(action).toEqual({
        type: ActionKeys.SHOW_LOADER,
    });
});

test('It should set up hide loader object', () => {
    const action = hideLoader();

    expect(action).toEqual({
        type: ActionKeys.HIDE_LOADER,
    });
});
