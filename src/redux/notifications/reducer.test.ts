import { reducer as notificationsReducer } from './reducer';
import { setError, setParameterization, setNotifications } from './actions';
import { parameterization, notifications, parameterizationBuyAndSell } from './action.test';

const initialState = {
    error: '',
    dailyNotifications: [],
    status: 200,
};

test('It should set the notification parameterization data', () => {
    const action = setParameterization(parameterization);
    const state = notificationsReducer(initialState, action);
    expect(state).toEqual({
        ...state,
        parameterization,
    });
});

test('It should set the notifications', () => {
    const action = setNotifications(notifications);
    const state = notificationsReducer(initialState, action);
    expect(state).toEqual({
        ...state,
        notifications,
    });
});

test('It should set error', () => {
    const action = setError('The given data was invalid.');
    const state = notificationsReducer(initialState, action);
    expect(state).toEqual({ ...state, error: 'The given data was invalid.' });
});

test('It should set the notification parameterization data for buying and selling', () => {
    const action = setParameterization(parameterizationBuyAndSell);
    const state = notificationsReducer(initialState, action);
    expect(state).toEqual({
        ...state,
        parameterization,
    });
});
