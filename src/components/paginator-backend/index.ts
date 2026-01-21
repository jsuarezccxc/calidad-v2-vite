import { IGenericRecord } from '@models/GenericRecord';
import { HttpMethod } from '@models/Request';

export * from './PaginatorBackend';

/**
 * This interface describes the props of the paginator backend
 *  
 * @typeParam Type: IGenericRecord - Type of data
 * @typeParam data: Type[] - Data to be paginated
 * @typeParam meta: IMetaInterface - Meta information of the pagination
 * @typeParam links: ILinksInterface - Links for pagination
 * @typeParam wrapperClassName: string - Class name for the wrapper
 * @typeParam setData: (data?: IGenericRecord) => void - Function to set data
 * @typeParam method: string - Optional type of the paginator 
 * @typeParam params: IGenericRecord - Optional data to be sent in the request
 *  
 * @returns IPaginatorBackend<Type>
 */
export interface IPaginatorBackend<Type> {
    data: Type[];
    meta: IMetaInterface;
    links: ILinksInterface;
    wrapperClassName?: string;
    setData?: (data?: IGenericRecord) => void;
    method?: HttpMethod;
    params?: IGenericRecord;
}

//Same as IPaginatorBackend but with data as a single object
export interface IPaginatorBackendObj<T> extends Omit<IPaginatorBackend<T>, 'data'> {
    data: T;
}

export interface IMetaInterface {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
}

export interface ILinksInterface {
    first: string;
    last: string;
    next: string;
    prev: string;
}

/**
 * First number page
 */
export const FIRST_STEP = 0 | 1;

