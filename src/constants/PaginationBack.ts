import { ILinksInterface, IMetaInterface } from "@components/paginator-backend";
import { IGenericRecord } from "@models/GenericRecord";

export interface IGenericPaginationData<Type = IGenericRecord> {
    data: Type[];
    meta: IMetaInterface;
    links: ILinksInterface;
    params?: IGenericRecord;
}

export const paginationDataFormat: IGenericPaginationData = {
        meta: {
            current_page: 1,
            from: 1,
            last_page: 1,
            path: '',
            per_page: 1,
            to: 1,
            total: 1,
        },
        data: [],
        links: {
            prev: '',
            first: '',
            last: '',
            next: '',
        },
    }

    export const paginationDataFormatDynamic = <T>(): IGenericPaginationData<T> =>{ return{
        meta: {
            current_page: 1,
            from: 1,
            last_page: 1,
            path: '',
            per_page: 1,
            to: 1,
            total: 0,
        },
        data: [] as T[],
        links: {
            prev: '',
            first: '',
            last: '',
            next: '',
        },
    }}
    