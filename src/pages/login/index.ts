import { FALSE_STR, TRUE_STR } from '@constants/Login';

export { default } from './Login';

/**
 * Hide recaptcha by email or tests
 * @param email - Is email user
 * @returns boolean
 */
export const hideRecaptchaEmailOrTests = (email: string): boolean =>
    process.env.REACT_APP_DEBUG === FALSE_STR ||
    (process.env.REACT_APP_DEBUG === TRUE_STR && email !== process.env.REACT_APP_EMAIL_AUTOMATION);

/**
 * This interface describes what properties the custom modal component receives
 *
 * @typeParam handleOpenModalMigration: () => void - ShowModal Function to change state of modal
 */
export interface ILoginProps {
    handleOpenModalMigration: () => void;
}
