import { showMenu } from './actions';
import { ActionKeys } from './types';

test('It should set up show menu object', () => {
    const action = showMenu();

    expect(action).toEqual({
        type: ActionKeys.SHOW_MENU,
    });
});
