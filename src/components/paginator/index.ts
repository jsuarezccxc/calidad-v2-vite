import { Dispatch, SetStateAction } from 'react';
import { IGenericRecord } from '@models/GenericRecord';
export * from './Paginator';

/**
 * This interface describes type of data paginator component receive
 *
 * @typeParam id: string - unique id
 * @typeParam data: IGenericRecord[] - Paginator data
 * @typeParam dataLimits: IGenericRecord[] - Paginator data with the limits
 * @typeParam limits: ILimits - Paginator limits
 * @typeParam setLimits: Dispatch<SetStateAction<ILimits>> - Set the paginator limits
 * @typeParam currentPage: number - Current page
 * @typeParam setCurrentPage: Dispatch<SetStateAction<number>> - Set the current page
 * @typeParam wrapperClassName: string - Optional prop for customize the paginator
 * @typeParam electronicDocument: boolean - Optional prop for toggle the number of total pages
 * @typeParam isGroupPaginator: boolean - Optional prop for active pager group
 * @typeParam numberGroupPaginator: number - Optional prop for items group
 * @typeParam numberPaginator: ILimits - option prop for paginator page
 * @typeParam setNumberPaginator: Dispatch<SetStateAction<ILimits>> - Option prop for set paginator page
 * @typeParam enableArrows: boolean - Optional state to show arrows without conditional
 * @typeParam reload: boolean - Optional state to reload the paginator
 */
export interface IPaginatorProps {
    id?: string;
    data: IGenericRecord[];
    dataLimits: IGenericRecord[];
    limits: ILimits;
    setLimits: Dispatch<SetStateAction<ILimits>>;
    currentPage: number;
    setCurrentPage: Dispatch<SetStateAction<number>>;
    wrapperClassName?: string;
    electronicDocument?: boolean;
    isGroupPaginator?: boolean;
    numberGroupPaginator?:number;
    numberPaginator?:ILimits;
    setNumberPaginator?: Dispatch<SetStateAction<ILimits>>;
    enableArrows?: boolean;
    customItemPage?: number;
    reload?: boolean;
}

/**
 * This interface are numbers of pagination
 *
 * @typeParam number: number - Number of page
 * @typeParam current: number - Current page
 * @typeParam onClick: () => void - Changes page
 * @typeParam isGroupPaginator: boolean - Optional prop pager group
 */
export interface IPageNumber {
    number: number;
    current: number;
    onClick: () => void;
    isGroupPaginator?: boolean;
}

/**
 * This interface describes the limits of the pagination
 *
 * @typeParam start: number - Start element of the page
 * @typeParam finish: number - Finish element of the page
 */
export interface ILimits {
    start: number;
    finish: number;
}
