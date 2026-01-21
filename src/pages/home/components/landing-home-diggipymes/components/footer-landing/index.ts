import { Dispatch, SetStateAction } from 'react';
import { urls } from '@api/urls';
import { TERMS_AND_CONDITIONS_URL } from '@constants/Politics';

export * from './FooterLanding';

/**
 * This constants routes
 */
export const ROUTES_DIGGI = {
    TERMS: TERMS_AND_CONDITIONS_URL,
    DATA_TREATMENT: urls.footer.politics,
    INSTAGRAM: 'https://www.instagram.com/diggipymes/',
    LINKEDIN: 'https://www.linkedin.com/company/ccxc',
    YOUTUBE: 'https://www.youtube.com/channel/UClPmwyTAXJdvtTwYWcSWceg',
    CCXC: 'https://ccxc.co/',
};

/**
 * This interface describes the footer props
 *
 * @typeParam openSheduling: boolean - State open sheduling
 * @typeParam setOpenSheduling: Dispatch<SetStateAction<boolean>> - Dispatch state open sheduling
 */
export interface IFooterLandingProps {
    openScheduling: boolean;
    setOpenScheduling: Dispatch<SetStateAction<boolean>>;
}
