export * from './HeroLanding';

/**
 * This interface describes the props of the Hero Landing component.
 *
 * @typeParam toggleAccount - (Optional) Function to toggle the account modal
 * @typeParam toggleScheduling - Function to toggle the scheduling state
 */
export interface IHeroLandingProps {
    toggleAccount?: () => void;
    toggleScheduling: () => void;
}

/**
 * URL query parameter used to enable demo mode
 */
export const DEMO = 'demo';

/**
 * Index of query string after '?' in location.hash.split('?'), used to check if demo view should open
 * */
export const HASH_QUERY_INDEX = 1;
