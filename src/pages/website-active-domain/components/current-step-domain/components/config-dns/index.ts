export * from './ConfigDns';

/**
 * Interface props from config dns
 * 
 * @typeParam domains: string[] - list of dns
 * @typeParam handleValidateStep: () => void - Action to validate step
 */
export interface IConfigDnsProps {
    domains: string[];
    handleValidateStep: () => void;
}
