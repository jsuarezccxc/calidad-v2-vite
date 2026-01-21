import { Dispatch, SetStateAction } from 'react';
import { ILimits } from '@components/paginator';
import { IGenericRecord } from '@models/GenericRecord';
import { ITEMS_PAGE } from '@constants/Paginator';

export const getLimits = (
    data: IGenericRecord[],
    limits: ILimits,
    setLimits: Dispatch<SetStateAction<ILimits>>,
    setCurrentPage: Dispatch<SetStateAction<number>>
): void => {
    const { start, finish } = limits;
    const pages = data?.slice(start, finish);
    if (!pages?.length && start) {
        setLimits({ start: 0, finish: ITEMS_PAGE });
        setCurrentPage(0);
    }
};
