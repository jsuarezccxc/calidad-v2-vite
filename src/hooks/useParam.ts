import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

/**
 * This interface describes that properties the useParam hook return
 *
 * @typeParam queryParam: string - Query param value
 * @typeParam search: string - Search param of the useLocation
 * @typeParam id: string - Param id
 */
interface IUseParam {
    queryParam: string;
    search: string;
    id: string;
}

/**
 * Custom hook that return the query param of the current route
 *
 * @typeParam paramName: string - Name of the query param
 * @returns IUseParam
 */
const useParam = (paramName = 'invoice'): IUseParam => {
    const { search } = useLocation();
    const parsedQuery = queryString.parse(search);
    const queryParam = String(parsedQuery[paramName] || '');
    const id = String(parsedQuery.id || '');
    return { queryParam, search, id };
};

export default useParam;
