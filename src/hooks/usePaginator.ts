import { useState } from 'react';
import { getLimits as getPagination } from '@utils/Paginator';
import { IGenericRecord } from '@models/GenericRecord';
import { ITEMS_PAGE, START_PAGE } from '@constants/Paginator';
import { IPaginatorProps, ILimits } from '@components/paginator';

/**
 * This interface describes that properties the usePaginator hook return
 *
 * @typeParam paginator: IPaginatorProps - Paginator props
 * @typeParam getLimits: () => void - Function that get the limits of the pagination
 */
export interface IUsePaginator {
    paginator: IPaginatorProps;
    getLimits: () => void;
}

/**
 * Custom hook that do the pagination of the tables
 *
 * @param data: IGenericRecord[] - Table data
 * @returns IUsePaginator
 */
const usePaginator = (data: IGenericRecord[], finish = ITEMS_PAGE): IUsePaginator => {
    const [currentPage, setCurrentPage] = useState<number>(START_PAGE);
    const [limits, setLimits] = useState<ILimits>({
        start: 0,
        finish,
    });

    const getLimits = (): void => {
        getPagination(data, limits, setLimits, setCurrentPage);
    };

    const dataLimits = data?.slice(limits.start, limits.finish);

    const paginator = {
        data,
        dataLimits,
        limits,
        setLimits,
        currentPage,
        setCurrentPage,
        customItemPage: finish,
    };

    return { paginator, getLimits };
};

export default usePaginator;
