export * from './Domains';

/**
 * Interface props from domains table component
 *
 * @typeParam domains: string[] - List of dns to show from user
 * @typeParam customAction: () => void - Custom action with clipboard
 */
export interface IDomainsProps {
    domains: string[];
    customAction?: () => void;
}
