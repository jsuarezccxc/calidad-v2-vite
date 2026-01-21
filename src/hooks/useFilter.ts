import { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import { IOptionSelect } from '@components/input';
import { lengthEqualToZero } from '@utils/Length';

/**
 * This interface describes that properties the useFilter hook return
 *
 * @typeParam onChangeFilter: (opt: IOptionSelect) => void - Function that allows add or change value for filters
 * @typeParam dataFiltered: IGenericRecord[] - Return filter data according to filters
 * @typeParam filter: IGenericRecord[] - Array that defines filter or filters for data
 * @typeParam setFilter: Dispatch<SetStateAction<IGenericRecord[]>> - Action that dispatch for adding or changing filters
 */
interface IUseFilter {
    onChangeFilter: (opt: IOptionSelect) => void;
    dataFiltered: IGenericRecord[];
    filter: IGenericRecord[];
    setFilter: Dispatch<SetStateAction<IGenericRecord[]>>;
}

/**
 * Custom hook that filter data
 *
 * @param data: IGenericRecord[] - Initial data
 * @returns IUseFilter
 */
const useFilter = (data: IGenericRecord[]): IUseFilter => {
    const [filter, setFilter] = useState<IGenericRecord[]>([]);
    const [dataFiltered, setDataFiltered] = useState<IGenericRecord[]>([]);

    useEffect(() => {
        if (data) {
            if (filter.some((fil: IGenericRecord) => fil.key === 'all')) return setDataFiltered(data);
            setDataFiltered(data.filter((data: IGenericRecord) => validateData(data)));
        }
    }, [filter]);

    const validateData = (data: IGenericRecord): boolean => {
        return filter.map((fil: IGenericRecord) => fil.value === data[fil.type]).every((er: boolean) => er === true);
    };

    const onChangeFilter = (option: IGenericRecord): void => {
        if (lengthEqualToZero(filter) || filter.some((fil: IGenericRecord) => fil.type !== option.type)) {
            setFilter([...filter, option]);
        }

        if (filter.some((fil: IGenericRecord) => fil.type === option.type)) {
            const updateOpt = filter.map((fil: IGenericRecord) => {
                if (fil.type === option.type) {
                    return { ...fil, value: option.value, key: option.key };
                }
                return { ...fil };
            });
            setFilter(updateOpt);
        }
    };

    return {
        filter,
        setFilter,
        onChangeFilter,
        dataFiltered,
    };
};

export default useFilter;
