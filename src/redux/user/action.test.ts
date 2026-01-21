import { logoutUser } from './actions';
import { ActionKeys } from './types';

// Create a test for each action of your module

/**
 * Objective test from logoutUser
 */
test('it should set up logoutUser object', () => {
    //Test action logoutUser
    const action = logoutUser();

    //Expected response when the action is executed
    expect(action).toEqual({
        type: ActionKeys.LOGOUT,
    });
});
