export * from './LandingHeader';

/**
 * @typeParam darkMode - Indicates whether the button should be styled for dark mode.
 */
export interface ILandingHeader {
    darkMode?: boolean;
}

export const CREATED_ACCOUNT_BUTTON = 'Cuenta creada';

export const LOGIN_BUTTON = 'Iniciar sesión';

export const HEADER_BUTTONS_TOOLTIP =
    'Si usted ya ha comprado un módulo de diggi pymes haga click en el botón Iniciar sesión. Si usted ya creó una cuenta, pero no ha comprado ningún módulo, haga click en el botón Cuenta creada.';
