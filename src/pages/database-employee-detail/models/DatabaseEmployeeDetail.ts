import { IContractDetail, IEmployeeDetail } from "@models/DataEmployees";

/**
 * Interface data employee in detail
 * 
 * @typeParam birthday: string | null - Birthday formatted
 * @typeParam contract: IContractEmployee - New formatted type
 */
export interface IDataEmployee extends Omit<IEmployeeDetail, 'birthday' | 'contract'> {
    birthday: string | null;
    contract: IContractEmployee
}

/**
 * Interface data contract in detail
 * 
 * @typeParam initial_date: string | null - Initial date contract formatted
 * @typeParam final_date: string | null - Final date contract formatted
 * @typeParam salary: string | null - Salary contract formatted
 * @typeParam has_transportation_assistance: string | null - Text formatted
 */
interface IContractEmployee extends Omit<IContractDetail, 'initial_date' | 'final_date' | 'salary' | 'has_transportation_assistance'> {
    initial_date: string | null;
    final_date: string | null;
    salary: string | null;
    has_transportation_assistance: string | null;
}

/**
 * Interface card detail props 
 * 
 * @typeParam data: IDataEmployee - data card detail employee
 */
export interface ICardDetailProps {
    data: IDataEmployee;
}
