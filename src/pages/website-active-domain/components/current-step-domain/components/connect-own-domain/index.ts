export * from './ConnectOwnDomain';

/**
 * Interface props from connect own domain
 *
 * @typeParam invalidDomain: boolean - State to know if domain is invalid
 * @typeParam emptyDomain: boolean - State to know if domain is empty
 * @typeParam value: string - Current value from input
 * @typeParam onChange: (value: string) => void - Current action from input
 * @typeParam currentPage: number - Current page paginator
 * @typeParam handleMainAction: () => void - Custom action to execute in active button
 */
export interface IConnectOwnDomainProps {
    invalidDomain: boolean;
    emptyDomain: boolean;
    value: string;
    onChange: (value: string) => void;
    currentPage: number;
    handleMainAction: () => void;
}
