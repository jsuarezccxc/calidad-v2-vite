import { IPropsInput } from '@components/input';
import { IHeaderTable } from '@components/table';

export * from './inputs/Inputs';
export * from './header-database-employee/HeaderDatabaseEmployee';

/**
 * This interface describes the inputs props
 *
 * @typeParam data: IPropsInput[] - List with the input props
 * @typeParam handleRedirect: () => void - Action to redirect screen
 */
export interface IInputsProps {
    data: IPropsInput[];
    handleRedirect: () => void
}

/**
 * This interface describe header table database employee
 * 
 * @typeParam data: IHeaderTable[] - Data headers for table
 */
export interface IHeaderTableDatabaseEmployee {
    data: IHeaderTable[]
}

