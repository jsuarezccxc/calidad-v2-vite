export { default } from './AccountCreated';

/**
 * Initial data user
 */
export const INITIAL_DATA = {
    email: '',
    password: '',
};

/**
 * Initial data validation fields
 */
export const REQUIRED_DATA = {
    email: {
        error: false,
        text: '',
    },
    password: {
        error: false,
        text: '',
    },
};
