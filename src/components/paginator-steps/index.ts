import { IGenericRecord } from '@models/GenericRecord';

export * from './PaginatorSteps';

/**
 * Interface props for paginator props
 *
 * @typeParam data: IGenericRecord[] - Data to paginate
 * @typeParam currentPage: number - current page to show data
 * @typeParam setCurrentPage: (currentPage: number) => void - Action to change current page
 * @typeParam wrapperClassName: string - Optional className to customize the wrapper
 *
 */
export interface IPaginatorStepsProps {
    data: IGenericRecord[];
    currentPage?: number;
    setCurrentPage?: (currentPage: number) => void;
    wrapperClassName?: string;
}

/**
 * First number page
 */
export const FIRST_STEP = 0 | 1;
