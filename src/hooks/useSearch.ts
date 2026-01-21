import { useState, ChangeEvent, Dispatch, SetStateAction } from 'react';
import { searchData } from '@utils/Search';
import { IGenericRecord } from '@models/GenericRecord';
import { INestedKey } from '@models/Search';

/**
 * This interface describes that properties the useSearch hook return
 *
 * @typeParam searchValue: string - Value of the word used to make a filter
 * @typeParam setSearchValue: Dispatch<SetStateAction<string>> - Action that dispatch for changing search value
 * @typeParam filterData: (e: ChangeEvent<HTMLInputElement>) => void - Function that filter the data according to the search value
 * @typeParam resultData: IGenericRecord[] - Filtered data result
 * @typeParam setResultData: Dispatch<SetStateAction<IGenericRecord[]>> - Action that dispatch for changing data
 */
interface IUseSearch {
    searchValue: string;
    setSearchValue: Dispatch<SetStateAction<string>>;
    filterData: (e: ChangeEvent<HTMLInputElement>) => void;
    resultData: IGenericRecord[];
    setResultData: Dispatch<SetStateAction<IGenericRecord[]>>;
}

/**
 * Custom hook that filter data
 *
 * @param data: IGenericRecord[] - Initial data
 * @param keys: string[] - Optional prop with the keys used in the filter
 * @param nestedKey: INestedKey - Optional prop used in case of the filter included nested data
 * @returns IUseSearch
 */
const useSearch = (data: IGenericRecord[], keys?: string[], nestedKey?: INestedKey): IUseSearch => {
    const [searchValue, setSearchValue] = useState<string>('');
    const [resultData, setResultData] = useState<IGenericRecord[]>(data);

    const filterData = (e: ChangeEvent<HTMLInputElement>): void => {
        setSearchValue(e.target.value);
        if (!data?.length) return;
        setResultData(searchData(data, e.target.value, keys, nestedKey));
    };

    return {
        searchValue,
        setSearchValue,
        filterData,
        resultData,
        setResultData,
    };
};

export default useSearch;
