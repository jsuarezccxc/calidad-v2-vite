import { useState } from 'react';

/**
 * This interface describes the properties returned by the custom hook
 *
 * @typeParam showSelectSearch: { [name: string]: boolean } - List with the component to render
 * @typeParam toggleSelectSearch: (show: boolean, name?: string) => void - Function to toggle showList state
 */
interface IUseSelectSearch {
    showSelectSearch: { [name: string]: boolean };
    toggleSelectSearch: (show: boolean, name?: string) => void;
}

/**
 * Custom hook to handle the select search
 *
 * @returns IUseSelectSearch
 */
const useSelectSearch = (): IUseSelectSearch => {
    const [showSelectSearch, setShowSelectSearch] = useState<{ [name: string]: boolean }>({});

    const toggleSelectSearch = (show: boolean, name = ''): void => setShowSelectSearch(name ? { [name]: show } : {});

    return {
        showSelectSearch,
        toggleSelectSearch,
    };
};

export default useSelectSearch;
