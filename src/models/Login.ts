/**
 * This interface describes a login data props for sending
 * @typeParam email: string - defines user's email
 * @typeParam password: string - defines user's password
 * @typeParam is_account_created: boolean - Optional - defines if user comes account created or login
 * @typeParam recaptchaValue: string - Optional recaptcha google token
 */
export interface ILoginData {
    email: string;
    password: string;
    is_account_created?: boolean;
    recaptchaValue?: string;
}

/**
 * A generic interface to use when add header to request
 *
 * @typeParam [key: string]: string - type value
 */
export interface IHeaders {
    [key: string]: string;
}

/**
 * This interface describes a login data props for sending
 * @typeParam email: string - defines user's email
 */
export interface IRecoverPasswordData {
    email: string;
}

/**
 * This interface describes a login data props for sending
 * @typeParam email: string - defines user's email
 * @typeParam password: string - defines user's new password
 * @typeParam password_confirmation: string - defines user's new password confirmation
 * @typeParam token: string - defines user's token for changing password
 * @typeParam change_location: string - Location user browser
 * @typeParam change_device: string - Device user browser
 * @typeParam longitude: string - longitude user browser
 * @typeParam latitude: string - latitude user browser
 */
export interface IChangePassword {
    email: string;
    password: string;
    password_confirmation: string;
    token: string;
    change_location: string;
    change_device: string;
    longitude: string;
    latitude: string;
}
