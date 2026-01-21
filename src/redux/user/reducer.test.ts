import { reducer as userReducer } from './reducer';
import { logoutUser } from './actions';

// Create a test for each reducer module

/**
 * Objective with the logout user test
 */
it('should clear login user info', function () {
    // Declaration initial state from reducer
    const initialState = { isLogin: false, error: '' };
    // Test action logoutUser when run correctly
    const action = logoutUser();
    // When test reducer execute the action and initial state
    const state = userReducer(initialState, action);
    //Expected response when the action is executed from reducer
    expect(state).toEqual({ isLogin: false, error: '' });
});
