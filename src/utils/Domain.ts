/**
 * This creates a subdomain by joining the url to the domain
 *
 * @param url: string - Website url
 * @returns string
 */
export const createSubdomain = (url: string): string => `${validateUrl(url)}.${process.env.REACT_APP_AWS_ROOT_DOMAIN}`;

/**
 * This returns the url removing the domain
 *
 * @param subdomain: string - Website subdomain
 * @returns string
 */
export const getUrl = (subdomain = ''): string => subdomain.split(`.${process.env.REACT_APP_AWS_ROOT_DOMAIN}`)[0];

/**
 * This validates the url, removing unnecessary characters
 *
 * @param url: string - Website url
 * @returns string
 */
const validateUrl = (url: string): string => url.replace(url.includes('www.') ? 'www.' : 'https://', '');
